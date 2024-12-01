import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import authService from "../../services/auth/authService";

export const registerUser = createAsyncThunk<
  { name: string; email: string; message: string },
  { name: string; email: string; password: string },
  { rejectValue: { message: string } }
>(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { message } = await authService.registerUser(name, email, password);
      return { name, email, message };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue({
          message: error.response.data.message,
        });
      }
      return rejectWithValue({
        message: "An unknown error occurred while registering a user",
      });
    }
  }
);

export const verifyEmail = createAsyncThunk<
  { message: string },
  { email: string; code: string },
  { rejectValue: { message: string } }
>("auth/verifyEmail", async ({ email, code }, { rejectWithValue }) => {
  try {
    const { message } = await authService.verifyEmail(email, code);
    return { message };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message,
      });
    }
    return rejectWithValue({
      message: "An unknown error occurred while sending the verification email",
    });
  }
});

export const loginUser = createAsyncThunk<
  {
    name: string;
    email: string;
    createdAt: string;
    plan: string;
    message: string;
  },
  { email: string; password: string },
  { rejectValue: { message: string } }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await authService.loginUser(email, password);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message,
      });
    }
    return rejectWithValue({
      message: "An unknown error occurred while loggin in the user",
    });
  }
});

export const logoutUser = createAsyncThunk<
  {
    message: string;
  },
  void,
  { rejectValue: { message: string } }
>("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.logoutUser();
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message,
      });
    }
    return rejectWithValue({
      message: "An unknown error occurred while logging out the user",
    });
  }
});

export const verifyToken = createAsyncThunk<
  unknown,
  void,
  { rejectValue: { message: string } }
>("auth/verifyToken", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.verifyToken();
    return response;
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message;

      return rejectWithValue({
        message: errorMessage,
      });
    }
    return rejectWithValue({
      message:
        "An unknown error occurred while verifying the token in the user action state",
    });
  }
});

export const updateUserName = createAsyncThunk<
  { name: string; message: string },
  { name: string; email: string },
  { rejectValue: { message: string } }
>("user/updateUserName", async ({ name, email }, { rejectWithValue }) => {
  try {
    const { message } = await authService.updateUserName(name, email);
    return { name, message };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message,
      });
    }
    return rejectWithValue({
      message: "An unknown error occurred while updating the user name",
    });
  }
});

export const updatePassword = createAsyncThunk<
  { message: string },
  { password: string; email: string },
  { rejectValue: { message: string } }
>("user/updatePassword", async ({ password, email }, { rejectWithValue }) => {
  try {
    const { message } = await authService.updatePassword(password, email);
    return { message };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message,
      });
    }
    return rejectWithValue({ message: "An unexpected error occurred" });
  }
});

export const sendEmail = createAsyncThunk<
  { message: string; email: string },
  { email: string },
  { rejectValue: { message: string } }
>("auth/sendEmail", async ({ email }, { rejectWithValue }) => {
  try {
    const { message } = await authService.sendEmail(email);
    return { message, email };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message,
      });
    }
    return rejectWithValue({
      message: "An unknown error occurred while sending the verification email",
    });
  }
});

export const deactivateAccount = createAsyncThunk<
  { message: string },
  { email: string; reason: string },
  { rejectValue: { message: string } }
>("auth/deactivateAccount", async ({ email, reason }, { rejectWithValue }) => {
  try {
    const { message } = await authService.deactivateAccount(email, reason);
    return { message };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data.message,
      });
    }
    return rejectWithValue({
      message: "An unknown error occurred while deactivating the account",
    });
  }
});
