import { createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/user/userService";
import { RootState } from "../store";
import handleError from "../../utils/common/handleError";
import axios from "axios";

export const registerUser = createAsyncThunk<
  { name: string; email: string; message: string },
  { name: string; email: string; password: string },
  { rejectValue: { message: string } }
>(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await userService.registerUser(name, email, password);
      return response;
    } catch (error) {
      return handleError.actionError(
        error,
        rejectWithValue,
        "registering the user"
      );
    }
  }
);

export const verifyEmail = createAsyncThunk<
  { message: string },
  { email: string; code: string },
  { rejectValue: { message: string } }
>("auth/verifyEmail", async ({ email, code }, { rejectWithValue }) => {
  try {
    const { message } = await userService.verifyEmail(email, code);
    return { message };
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "sending the verification email"
    );
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
    const response = await userService.loginUser(email, password);
    return response;
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "logging in the user"
    );
  }
});

export const loginUserWithGoogle = createAsyncThunk<
  {
    name: string;
    email: string;
    createdAt: string;
    plan: string;
    message: string;
  },
  { idToken: string },
  { rejectValue: { message: string } }
>("auth/loginUserWithGoogle", async ({ idToken }, { rejectWithValue }) => {
  try {
    const response = await userService.loginUserWithGoogle(idToken);
    return response;
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "logging in the user with Google"
    );
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
    const response = await userService.logoutUser();
    return response;
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "logging out the user"
    );
  }
});

export const verifyToken = createAsyncThunk<
  { userId: string },
  void,
  { rejectValue: { message: string } }
>("auth/verifyToken", async (_, { rejectWithValue, getState }) => {
  const state = getState() as RootState;
  const email = state.user.userEmail;

  try {
    const response = await userService.verifyToken();
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status } = error.response || {};
      if (status === 401 || status === 403) {
        try {
          const response = await userService.refreshToken(email);
          return response;
        } catch (refreshError) {
          const message = handleError.apiError(refreshError);
          return rejectWithValue({ message });
        }
      }
      const message = handleError.apiError(error);
      return rejectWithValue({ message });
    }
    return handleError.actionError(
      error,
      rejectWithValue,
      "verifying the token"
    );
  }
});

export const sendEmail = createAsyncThunk<
  { message: string; email: string },
  { email: string },
  { rejectValue: { message: string } }
>("auth/sendEmail", async ({ email }, { rejectWithValue }) => {
  try {
    const { message } = await userService.sendEmail(email);
    return { message, email };
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "sending the verification email"
    );
  }
});

export const updateUserName = createAsyncThunk<
  { name: string; message: string },
  { name: string; email: string },
  { rejectValue: { message: string } }
>("user/updateUserName", async ({ name, email }, { rejectWithValue }) => {
  try {
    const response = await userService.updateUserName(name, email);
    return response;
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "updating the user name"
    );
  }
});

export const updatePassword = createAsyncThunk<
  { message: string },
  { password: string; email: string },
  { rejectValue: { message: string } }
>("user/updatePassword", async ({ password, email }, { rejectWithValue }) => {
  try {
    const { message } = await userService.updatePassword(password, email);
    return { message };
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "updating the password"
    );
  }
});

export const deactivateAccount = createAsyncThunk<
  { message: string },
  { email: string; reason: string },
  { rejectValue: { message: string } }
>("auth/deactivateAccount", async ({ email, reason }, { rejectWithValue }) => {
  try {
    const { message } = await userService.deactivateAccount(email, reason);
    return { message };
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "deactivating the account"
    );
  }
});
