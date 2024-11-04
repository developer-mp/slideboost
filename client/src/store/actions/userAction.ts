import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import authService from "../../services/auth/authService";
import userService from "../../services/user/userService";
import { LoginResponse } from "../../interfaces/interfaces";

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
  { token: string; name: string; email: string; message?: string },
  { email: string; password: string },
  { rejectValue: { message: string } }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response: LoginResponse = await authService.loginUser(
      email,
      password
    );
    return { ...response, email };
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
