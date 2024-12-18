import { createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/user/userService";
import { RootState } from "../store";

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
      if (error instanceof Error) {
        const errorMessage = error.message;
        return rejectWithValue({
          message: errorMessage,
        });
      }
      return rejectWithValue({
        message:
          "An unknown error occurred while registering the user in the User Action",
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
    const { message } = await userService.verifyEmail(email, code);
    return { message };
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message;
      return rejectWithValue({
        message: errorMessage,
      });
    }
    return rejectWithValue({
      message:
        "An unknown error occurred while sending the verification email in the User Action",
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
    const response = await userService.loginUser(email, password);
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
        "An unknown error occurred while logging in the user in the User Action",
    });
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
    if (error instanceof Error) {
      const errorMessage = error.message;
      return rejectWithValue({
        message: errorMessage,
      });
    }
    return rejectWithValue({
      message:
        "An unknown error occurred while logging in the user with Google in the User Action",
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
    const response = await userService.logoutUser();
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
        "An unknown error occurred while logging out the user in the User Action",
    });
  }
});

export const verifyToken = createAsyncThunk<
  {
    userId: string;
  },
  void,
  { rejectValue: { message: string } }
>("auth/verifyToken", async (_, { rejectWithValue, getState }) => {
  const state = getState() as RootState;
  const email = state.user.userEmail;
  try {
    const response = await userService.verifyToken();
    return response;
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message;
      if (
        errorMessage === "User not authenticated" ||
        errorMessage === "Access forbidden"
      )
        try {
          const response = await userService.refreshToken(email);
          return response;
        } catch (refreshError) {
          let refreshErrorMessage =
            "Error occurred while refreshing the token in the User Action";

          if (refreshError instanceof Error) {
            refreshErrorMessage = refreshError.message;
          } else if (typeof refreshError === "string") {
            refreshErrorMessage = refreshError;
          }

          return rejectWithValue({
            message: refreshErrorMessage,
          });
        }
      return rejectWithValue({
        message: errorMessage,
      });
    }
    return rejectWithValue({
      message:
        "An unknown error occurred while refreshing the token in the User Action",
    });
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
    if (error instanceof Error) {
      const errorMessage = error.message;
      return rejectWithValue({
        message: errorMessage,
      });
    }
    return rejectWithValue({
      message:
        "An unknown error occurred while sending the verification email in the User Action",
    });
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
    if (error instanceof Error) {
      const errorMessage = error.message;
      return rejectWithValue({
        message: errorMessage,
      });
    }
    return rejectWithValue({
      message:
        "An unknown error occurred while updating the user name in the User Action",
    });
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
    if (error instanceof Error) {
      const errorMessage = error.message;
      return rejectWithValue({
        message: errorMessage,
      });
    }
    return rejectWithValue({ message: "An unexpected error occurred" });
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
    if (error instanceof Error) {
      const errorMessage = error.message;
      return rejectWithValue({
        message: errorMessage,
      });
    }
    return rejectWithValue({
      message:
        "An unknown error occurred while deactivating the account in the User Action",
    });
  }
});
