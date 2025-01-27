import { createAsyncThunk } from "@reduxjs/toolkit";
import dataService from "../../services/data/dataService";
import handleError from "../../utils/common/handleError";

export const getTemplateCategories = createAsyncThunk<
  {
    data: [];
    message: string;
  },
  void,
  { rejectValue: { message: string } }
>("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    const response = await dataService.getTemplateCategories();
    return response;
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "getting the template categories"
    );
  }
});
