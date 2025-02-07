import { createAsyncThunk } from "@reduxjs/toolkit";
import pptService from "../../services/ppt/pptService";
import handleError from "../../utils/common/handleError";

export const generatePpt = createAsyncThunk<
  { data: []; message: string },
  { userId: string; fileId: string[]; templateId: string; title: string },
  { rejectValue: { message: string } }
>(
  "storage/generatePpt",
  async ({ userId, fileId, templateId, title }, { rejectWithValue }) => {
    try {
      const response = await pptService.generatePpt(
        userId,
        fileId,
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
