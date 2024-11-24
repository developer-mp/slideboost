import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import authService from "../../services/auth/authService";
import userService from "../../services/user/userService";
import { LoginResponseProps } from "../../interfaces/interfaces";

export const registerUser = createAsyncThunk<
  { name: string; email: string; message?: string },
  { name: string; email: string; password: string },
  { rejectValue: { message: string } }
>(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.registerUser(name, email, password);
      return { ...response.data, name, email };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Registration failed",
        });
      }
      return rejectWithValue({ message: "An unexpected error occurred" });
    }
  }
);

export const sendEmail = createAsyncThunk<
  { email: string; message?: string },
  { email: string },
  { rejectValue: { message: string } }
>("auth/sendEmail", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await authService.sendEmail(email);
    return { ...response.data, email };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message || "Could not send email",
      });
    }
    return rejectWithValue({ message: "An unexpected error occurred" });
  }
});

export const verifyEmail = createAsyncThunk<
  { email: string; code: string; message?: string },
  { email: string; code: string },
  { rejectValue: { message: string } }
>("auth/verifyEmail", async ({ email, code }, { rejectWithValue }) => {
  try {
    const response = await authService.verifyEmail(email, code);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message || "Verification failed",
      });
    }
    return rejectWithValue({ message: "An unexpected error occurred" });
  }
});

export const loginUser = createAsyncThunk<
  {
    token: string;
    name: string;
    email: string;
    createdAt: string;
    plan: string;
    message?: string;
  },
  { email: string; password: string },
  { rejectValue: { message: string } }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response: LoginResponseProps = await authService.loginUser(
      email,
      password
    );
    const { token, name, createdAt, plan } = response;
    return {
      token,
      name,
      email,
      createdAt,
      plan,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message || "Login failed",
      });
    }
    return rejectWithValue({ message: "An unexpected error occurred" });
  }
});

export const updateUserName = createAsyncThunk<
  string,
  { name: string; email: string },
  { rejectValue: { message: string } }
>("user/updateUserName", async ({ name, email }, { rejectWithValue }) => {
  try {
    await userService.updateUserName(name, email);
    return name;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message || "Failed to update password",
      });
    }
    return rejectWithValue({ message: "An unexpected error occurred" });
  }
});

export const updatePassword = createAsyncThunk<
  void,
  { password: string; email: string },
  { rejectValue: { message: string } }
>("user/updatePassword", async ({ password, email }, { rejectWithValue }) => {
  try {
    await userService.updatePassword(password, email);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message || "Failed to update password",
      });
    }
    return rejectWithValue({ message: "An unexpected error occurred" });
  }
});

export const resetPassword = createAsyncThunk<
  { email: string; password: string; message?: string },
  { email: string; password: string },
  { rejectValue: { message: string } }
>("auth/resetPassword", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await authService.resetPassword(email, password);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message || "Verification failed",
      });
    }
    return rejectWithValue({ message: "An unexpected error occurred" });
  }
});

export const deactivateAccount = createAsyncThunk<
  void,
  { email: string; reason: string },
  { rejectValue: { message: string } }
>("auth/deactivateAccount", async ({ email, reason }, { rejectWithValue }) => {
  try {
    await userService.deactivateAccount(email, reason);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message || "Reset password failed",
      });
    }
    return rejectWithValue({ message: "An unexpected error occurred" });
  }
});
