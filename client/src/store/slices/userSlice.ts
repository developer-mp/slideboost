import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  registerUser,
  verifyEmail,
  loginUser,
  loginUserWithGoogle,
  logoutUser,
  verifyToken,
  updateUserName,
  deactivateAccount,
  sendEmail,
  getCreditBalance,
} from "../actions/userAction";

interface UserState {
  isAuthenticated: boolean;
  userId: string;
  userEmail: string;
  userName: string;
  creditBalance: number;
  createdAt: string;
  isRegister: boolean;
  isReset: boolean;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  message: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  userId: "",
  userEmail: "",
  userName: "",
  creditBalance: 0,
  createdAt: "",
  isRegister: false,
  isReset: false,
  status: "idle",
  message: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
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
        state.userId = action.payload.id;
        state.userEmail = action.payload.email;
        state.userName = action.payload.name;
        state.createdAt = action.payload.createdAt;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || null;
      })
      .addCase(loginUserWithGoogle.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUserWithGoogle.fulfilled, (state, action) => {
        state.status = "success";
        state.isAuthenticated = true;
        state.userId = action.payload.id;
        state.userEmail = action.payload.email;
        state.userName = action.payload.name;
        state.createdAt = action.payload.createdAt;
        state.message = action.payload.message;
      })
      .addCase(loginUserWithGoogle.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.status = "success";
        state.isAuthenticated = false;
        state.userEmail = "";
        state.userName = "";
        state.createdAt = "";
        state.message = action.payload.message;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || null;
      })
      .addCase(verifyToken.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state) => {
        state.status = "success";
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload?.message || null;
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
      })
      .addCase(getCreditBalance.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getCreditBalance.fulfilled, (state, action) => {
        state.status = "success";
        state.creditBalance = action.payload.creditBalance;
      })
      .addCase(getCreditBalance.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || null;
      });
  },
});

export const { setIsRegister, setIsReset } = userSlice.actions;
export default userSlice.reducer;
