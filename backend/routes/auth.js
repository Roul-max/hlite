// JWT helper
const generateToken = (userId) => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Signup
router.post('/signup', [...validators], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Try saving user
    const user = new User({ name, email, password });
    const otp = user.generateOTP();
    await user.save();

    try {
      await sendOTPEmail(email, otp);
    } catch (mailErr) {
      console.error("Failed to send OTP:", mailErr);
      // Don’t block signup if email fails
    }

    res.status(201).json({
      message: 'Account created. Verify with OTP sent to email.',
      email,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
router.post('/login', [...validators], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      // Only generate OTP if expired
      if (!user.otp || new Date() > user.otp.expiresAt) {
        const otp = user.generateOTP();
        await user.save();
        try {
          await sendOTPEmail(email, otp);
        } catch (mailErr) {
          console.error("Failed to send OTP:", mailErr);
        }
      }

      return res.json({
        requiresOTP: true,
        message: 'Please verify your email with OTP.',
        email,
      });
    }

    // Verified → issue token
    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
