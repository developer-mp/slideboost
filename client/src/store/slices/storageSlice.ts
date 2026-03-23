import { createSlice } from "@reduxjs/toolkit";
import { FileDetailProps } from "../../interfaces/interfaces";
import { appApi } from "../api/appApi";

interface UserState {
  fileMetadata: FileDetailProps[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  message: string | null;
}

const initialState: UserState = {
  fileMetadata: [],
  status: "idle",
  message: null,
  error: null,
};

const storageSlice = createSlice({
  name: "fileStorage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(appApi.endpoints.getFileMetadata.matchPending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addMatcher(
        appApi.endpoints.getFileMetadata.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.fileMetadata = action.payload.data;
          state.message = action.payload.message;
        },
      )
      .addMatcher(
        appApi.endpoints.getFileMetadata.matchRejected,
        (state, action) => {
          state.status = "fail";
          state.message = null;
          state.error = (action.error as { message?: string })?.message || null;
        },
      );
  },
});

export default storageSlice.reducer;
