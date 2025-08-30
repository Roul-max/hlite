import api from "./api";

// Login request
export const login = async (email, password) => {
  return api.post("/auth/login", { email, password });
};

// Signup request
export const signup = async (name, email, password) => {
  return api.post("/auth/signup", { name, email, password });
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  return api.post("/auth/verify-otp", { email, otp });
};
