import api from "../api"; // this is your axios instance (api.js)

export const login = async (email, password) => {
  return api.post("/auth/login", { email, password });
};

export const signup = async (name, email, password) => {
  return api.post("/auth/signup", { name, email, password });
};

export const verifyOtp = async (email, otp) => {
  return api.post("/auth/verify-otp", { email, otp });
};
