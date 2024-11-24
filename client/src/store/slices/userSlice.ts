import { createSlice } from "@reduxjs/toolkit";
import { setToken, removeToken } from "../../utils/login/handleAuthToken";
import {
  registerUser,
  verifyEmail,
  loginUser,
  updateUserName,
  deactivateAccount,
  sendEmail,
} from "../actions/userAction";

interface UserState {
  isAuthenticated: boolean;
  userEmail: string;
  userName: string;
  createdAt: string;
  plan: string;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  message: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  userEmail: "",
  userName: "",
  createdAt: "",
  plan: "",
  status: "idle",
  message: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      removeToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "success";
        state.userEmail = action.payload.email;
        state.userName = action.payload.name;
        state.message = action.payload.message || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "fail";
        state.message = null;
        state.error = action.error.message || "Registration failed";
      })
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = "success";
        state.message = action.payload.message || null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "fail";
        state.message = null;
        state.error = action.error.message || "Verification failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "success";
        state.isAuthenticated = true;
        state.userEmail = action.payload.email;
        state.userName = action.payload.name;
        state.createdAt = action.payload.createdAt;
        state.plan = action.payload.plan;
        setToken(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || "Login failed";
      })
      .addCase(updateUserName.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.status = "success";
        state.userName = action.payload;
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || "Failed to update user name";
      })
      .addCase(sendEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.status = "success";
        state.userEmail = action.payload.email;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || "Failed to send email";
      })
      // .addCase(resetPassword.pending, (state) => {
      //   state.status = "loading";
      //   state.error = null;
      // })
      // .addCase(resetPassword.fulfilled, (state, action) => {
      //   state.status = "success";
      //   state.userEmail = action.payload.email;
      // })
      // .addCase(resetPassword.rejected, (state, action) => {
      //   state.status = "fail";
      //   state.error = action.payload?.message || "Failed to reset password";
      // })
      .addCase(deactivateAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deactivateAccount.fulfilled, (state) => {
        state.status = "success";
        state.isAuthenticated = false;
      })
      .addCase(deactivateAccount.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload?.message || "Failed to deactivate account";
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
