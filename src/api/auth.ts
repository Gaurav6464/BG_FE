import type { AuthFormInputs } from "../types/auth.type";
import axiosInstance from "./axiosInstance";

const User = {
  register: async (data: AuthFormInputs) => {
    try {
      const response = await axiosInstance.post("auth/signup", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  login: async (data: AuthFormInputs) => {
    try {
      const response = await axiosInstance.post("auth/login", data);
      return response.data;
    } catch (error) {
    throw error;
    }
  },
  verifyEmail: async (data: any) => {
    try {
      const response = await axiosInstance.post("auth/verify-email", data);
      return response.data;
    } catch (error) {
     throw error;
    }
  },
  resendOtp: async (data: any) => {
    try {
      const response = await axiosInstance.post("auth/resend-email", data);
      return response.data;
    } catch (error) {
    throw error;
    }
  },
    resendForgetpasswordOtp: async (data: any) => {
    try {
      const response = await axiosInstance.post("auth/forget-password", data);
      return response.data;
    } catch (error) {
    throw error;
    }
  },
    verifyForgetPassword: async (data: any) => {
    try {
      const response = await axiosInstance.post("auth/verify-forget-password", data);
      return response.data;
    } catch (error) {
    throw error;
    }
  },
   getUserDetails: async () => {
    try {
      const response = await axiosInstance.get("auth/getUserDetails");
      return response.data;
    } catch (error) {
    throw error;
    }
  },
  validateUserRole:async()=>{
        try {
      const response = await axiosInstance.get("auth/check-role-access");
      return response.data;
    } catch (error) {
    throw error;
    }
  }
};

export default User;
