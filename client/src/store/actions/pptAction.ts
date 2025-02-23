import { createAsyncThunk } from "@reduxjs/toolkit";
import pptService from "../../services/ppt/pptService";
import handleError from "../../utils/common/handleError";

export const calculateTokens = createAsyncThunk<
  {
    tokenCount: number;
    tokenCost: number;
    tokenLimit: number;
    message: string;
  },
  {
    userId: string;
    files: { file_id: string; file_type: string }[];
  },
  { rejectValue: { message: string } }
>("storage/calculateTokens", async ({ userId, files }, { rejectWithValue }) => {
  try {
    const response = await pptService.calculateTokens(userId, files);
    return response;
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "calculating the tokens"
    );
  }
});

export const generatePpt = createAsyncThunk<
  { message: string },
  {
    userId: string;
    files: { file_id: string; file_type: string }[];
    templateId: string;
    title: string;
  },
  { rejectValue: { message: string } }
>(
  "storage/generatePpt",
  async ({ userId, files, templateId, title }, { rejectWithValue }) => {
    try {
      const response = await pptService.generatePpt(
        userId,
        files,
        templateId,
        title
      );
      return response;
    } catch (error) {
      return handleError.actionError(
        error,
        rejectWithValue,
        "creating the presentation"
      );
    }
  }
);
