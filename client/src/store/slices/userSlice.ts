import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appApi } from "../api/appApi";

interface UserState {
  isAuthenticated: boolean;
  userId: string;
  userEmail: string;
  userName: string;
  creditBalance: number;
  createdAt: string;
  surveySent: boolean;
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
  surveySent: false,
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
    setSurveySent: (state, action: PayloadAction<boolean>) => {
      state.surveySent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(appApi.endpoints.registerUser.matchPending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addMatcher(
        appApi.endpoints.registerUser.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.userEmail = action.payload.email;
          state.userName = action.payload.name;
          state.message = action.payload.message;
        },
      )
      .addMatcher(
        appApi.endpoints.registerUser.matchRejected,
        (state, action) => {
          state.status = "fail";
          state.message = null;
          state.error = (action.error as { message?: string })?.message || null;
        },
      )
      .addMatcher(appApi.endpoints.verifyEmail.matchPending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addMatcher(
        appApi.endpoints.verifyEmail.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.message = action.payload.message;
        },
      )
      .addMatcher(
        appApi.endpoints.verifyEmail.matchRejected,
        (state, action) => {
          state.status = "fail";
          state.message = null;
          state.error = (action.error as { message?: string })?.message || null;
        },
      )
      .addMatcher(appApi.endpoints.loginUser.matchPending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(
        appApi.endpoints.loginUser.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.isAuthenticated = true;
          state.userId = action.payload.id;
          state.userEmail = action.payload.email;
          state.userName = action.payload.name;
          state.createdAt = action.payload.createdAt;
          state.surveySent = action.payload.surveySent;
          state.message = action.payload.message;
        },
      )
      .addMatcher(appApi.endpoints.loginUser.matchRejected, (state, action) => {
        state.status = "fail";
        state.error = (action.error as { message?: string })?.message || null;
      })
      .addMatcher(
        appApi.endpoints.loginUserWithGoogle.matchPending,
        (state) => {
          state.status = "loading";
          state.error = null;
        },
      )
      .addMatcher(
        appApi.endpoints.loginUserWithGoogle.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.isAuthenticated = true;
          state.userId = action.payload.id;
          state.userEmail = action.payload.email;
          state.userName = action.payload.name;
          state.createdAt = action.payload.createdAt;
          state.surveySent = action.payload.surveySent;
          state.message = action.payload.message;
        },
      )
      .addMatcher(
        appApi.endpoints.loginUserWithGoogle.matchRejected,
        (state, action) => {
          state.status = "fail";
          state.error = (action.error as { message?: string })?.message || null;
        },
      )
      .addMatcher(appApi.endpoints.logoutUser.matchPending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(
        appApi.endpoints.logoutUser.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.isAuthenticated = false;
          state.userId = "";
          state.userEmail = "";
          state.userName = "";
          state.createdAt = "";
          state.message = action.payload.message;
        },
      )
      .addMatcher(
        appApi.endpoints.logoutUser.matchRejected,
        (state, action) => {
          state.status = "fail";
          state.error = (action.error as { message?: string })?.message || null;
        },
      )
      .addMatcher(appApi.endpoints.verifyToken.matchPending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(
        appApi.endpoints.verifyToken.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.isAuthenticated = true;
          state.userId = action.payload.userId;
          state.error = null;
        },
      )
      .addMatcher(
        appApi.endpoints.verifyToken.matchRejected,
        (state, action) => {
          state.status = "fail";
          state.error = (action.error as { message?: string })?.message || null;
        },
      )
      .addMatcher(
        appApi.endpoints.refreshToken.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.isAuthenticated = true;
          state.userId = action.payload.userId;
          state.error = null;
        },
      )
      .addMatcher(appApi.endpoints.updateUserName.matchPending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(
        appApi.endpoints.updateUserName.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.userName = action.payload.name;
          state.message = action.payload.message;
        },
      )
      .addMatcher(
        appApi.endpoints.updateUserName.matchRejected,
        (state, action) => {
          state.status = "fail";
          state.error = (action.error as { message?: string })?.message || null;
        },
      )
      .addMatcher(appApi.endpoints.sendEmail.matchPending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(
        appApi.endpoints.sendEmail.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.userEmail = action.payload.email;
          state.message = action.payload.message;
        },
      )
      .addMatcher(appApi.endpoints.sendEmail.matchRejected, (state, action) => {
        state.status = "fail";
        state.error = (action.error as { message?: string })?.message || null;
      })
      .addMatcher(appApi.endpoints.deactivateAccount.matchPending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(
        appApi.endpoints.deactivateAccount.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.isAuthenticated = false;
          state.userId = "";
          state.message = action.payload.message;
        },
      )
      .addMatcher(
        appApi.endpoints.deactivateAccount.matchRejected,
        (state, action) => {
          state.status = "fail";
          state.error = (action.error as { message?: string })?.message || null;
        },
      )
      .addMatcher(appApi.endpoints.getCreditBalance.matchPending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(
        appApi.endpoints.getCreditBalance.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.creditBalance = action.payload.creditBalance;
        },
      )
      .addMatcher(
        appApi.endpoints.getCreditBalance.matchRejected,
        (state, action) => {
          state.status = "fail";
          state.error = (action.error as { message?: string })?.message || null;
        },
      );
  },
});

export const { setIsRegister, setIsReset, setSurveySent } = userSlice.actions;
export default userSlice.reducer;
