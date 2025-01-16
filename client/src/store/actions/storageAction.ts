import { createAsyncThunk } from "@reduxjs/toolkit";
import storageService from "../../services/storage/storageService";
import handleError from "../../utils/common/handleError";

export const uploadFile = createAsyncThunk<
  { message: string },
  { file: File[]; userId: string },
  { rejectValue: { message: string } }
>("storage/uploadFile", async ({ file, userId }, { rejectWithValue }) => {
  try {
    const response = await storageService.uploadFile(file, userId);
    return response;
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "uploading the file to the storage"
    );
  }
});
