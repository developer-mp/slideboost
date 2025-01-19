import { createAsyncThunk } from "@reduxjs/toolkit";
import storageService from "../../services/storage/storageService";
import handleError from "../../utils/common/handleError";
import { FileWithMetadata } from "../../interfaces/interfaces";

export const uploadFile = createAsyncThunk<
  { message: string },
  { file: FileWithMetadata[]; userId: string },
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

export const getFileMetadata = createAsyncThunk<
  { data: []; message: string },
  { userId: string },
  { rejectValue: { message: string } }
>("storage/fileMetadata", async ({ userId }, { rejectWithValue }) => {
  try {
    const response = await storageService.getFileMetadata(userId);
    return response;
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "retrieving the file metadata from the storage"
    );
  }
});

export const deleteFile = createAsyncThunk<
  { message: string },
  { fileId: string; fileName: string },
  { rejectValue: { message: string } }
>("storage/fileMetadata", async ({ fileId, fileName }, { rejectWithValue }) => {
  try {
    const response = await storageService.deleteFile(fileId, fileName);
    return response;
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "deleting the file from the storage"
    );
  }
});
