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
>("data/getTemplateCategories", async (_, { rejectWithValue }) => {
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

export const getDeactivationReasons = createAsyncThunk<
  {
    data: [];
    message: string;
  },
  void,
  { rejectValue: { message: string } }
>("data/getDeactivationReasons", async (_, { rejectWithValue }) => {
  try {
    const response = await dataService.getDeactivationReasons();
    return response;
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "getting the deactivation reasons"
    );
  }
});

export const getFaq = createAsyncThunk<
  {
    data: [];
    message: string;
  },
  void,
  { rejectValue: { message: string } }
>("data/getFaq", async (_, { rejectWithValue }) => {
  try {
    const response = await dataService.getFaq();
    return response;
  } catch (error) {
    return handleError.actionError(error, rejectWithValue, "getting the FAQ");
  }
});

export const getNews = createAsyncThunk<
  {
    data: [];
    message: string;
  },
  void,
  { rejectValue: { message: string } }
>("data/getNews", async (_, { rejectWithValue }) => {
  try {
    const response = await dataService.getNews();
    return response;
  } catch (error) {
    return handleError.actionError(error, rejectWithValue, "getting the news");
  }
});
