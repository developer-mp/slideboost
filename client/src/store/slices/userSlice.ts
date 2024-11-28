import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
  isRegister: boolean;
  isReset: boolean;
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
  isRegister: false,
  isReset: false,
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
    setIsRegister(state, action: PayloadAction<boolean>) {
      state.isRegister = action.payload;
    },
    setIsReset(state, action: PayloadAction<boolean>) {
      state.isReset = action.payload;
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
        state.isRegister = true;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "fail";
        state.message = null;
        state.error = action.error.message || null;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = "success";
        state.isRegister = false;
        state.message = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "fail";
        state.message = null;
        state.error = action.error.message || null;
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
        state.message = action.payload.message;
        setToken(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || null;
      })
      .addCase(updateUserName.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.status = "success";
        state.userName = action.payload.name;
        state.message = action.payload.message;
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || null;
      })
      .addCase(sendEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.status = "success";
        state.userEmail = action.payload.email;
        state.message = action.payload.message;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || null;
      })
      .addCase(deactivateAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deactivateAccount.fulfilled, (state, action) => {
        state.status = "success";
        state.isAuthenticated = false;
        state.message = action.payload.message;
      })
      .addCase(deactivateAccount.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || null;
      });
  },
});

export const { logout, setIsRegister, setIsReset } = userSlice.actions;
export default userSlice.reducer;
