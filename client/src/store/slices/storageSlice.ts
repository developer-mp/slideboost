import { createSlice } from "@reduxjs/toolkit";
import { getFileMetadata } from "../actions/storageAction";
import { FileDetailProps } from "../../interfaces/interfaces";

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
      .addCase(getFileMetadata.pending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addCase(getFileMetadata.fulfilled, (state, action) => {
        state.status = "success";
        state.fileMetadata = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getFileMetadata.rejected, (state, action) => {
        state.status = "fail";
        state.message = null;
        state.error = action.error.message || null;
      });
  },
});

export default storageSlice.reducer;
