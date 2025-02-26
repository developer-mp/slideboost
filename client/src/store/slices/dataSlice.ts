import { createSlice } from "@reduxjs/toolkit";
import {
  DeactivationReason,
  SupportedFiles,
  Faq,
  News,
  TemplateCategory,
} from "../../interfaces/interfaces";
import {
  getTemplateCategories,
  getDeactivationReasons,
  getSupportedFiles,
  getFaq,
  getNews,
} from "../actions/dataAction";

interface DataState {
  templateCategories: TemplateCategory[];
  deactivationReasons: DeactivationReason[];
  supportedFiles: SupportedFiles[];
  faq: Faq[];
  news: News[];
  isCategoriesFetched: boolean;
  isReasonsFetched: boolean;
  isFaqFetched: boolean;
  isNewsFetched: boolean;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  message: string | null;
}

const initialState: DataState = {
  templateCategories: [],
  deactivationReasons: [],
  supportedFiles: [],
  faq: [],
  news: [],
  isCategoriesFetched: false,
  isReasonsFetched: false,
  isFaqFetched: false,
  isNewsFetched: false,
  status: "idle",
  message: null,
  error: null,
};

const dataSlice = createSlice({
  name: "dataStorage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTemplateCategories.pending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addCase(getTemplateCategories.fulfilled, (state, action) => {
        state.status = "success";
        state.templateCategories = action.payload.data;
        state.isCategoriesFetched = true;
        state.message = action.payload.message;
      })
      .addCase(getTemplateCategories.rejected, (state, action) => {
        state.status = "fail";
        state.message = null;
        state.error = action.error.message || null;
      })
      .addCase(getDeactivationReasons.pending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addCase(getDeactivationReasons.fulfilled, (state, action) => {
        state.status = "success";
        state.deactivationReasons = action.payload.data;
        state.isReasonsFetched = true;
        state.message = action.payload.message;
      })
      .addCase(getDeactivationReasons.rejected, (state, action) => {
        state.status = "fail";
        state.message = null;
        state.error = action.error.message || null;
      })
      .addCase(getSupportedFiles.pending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addCase(getSupportedFiles.fulfilled, (state, action) => {
        state.status = "success";
        state.supportedFiles = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getSupportedFiles.rejected, (state, action) => {
        state.status = "fail";
        state.message = null;
        state.error = action.error.message || null;
      })
      .addCase(getFaq.pending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addCase(getFaq.fulfilled, (state, action) => {
        state.status = "success";
        state.faq = action.payload.data;
        state.isFaqFetched = true;
        state.message = action.payload.message;
      })
      .addCase(getFaq.rejected, (state, action) => {
        state.status = "fail";
        state.message = null;
        state.error = action.error.message || null;
      })
      .addCase(getNews.pending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.status = "success";
        state.news = action.payload.data;
        state.isNewsFetched = true;
        state.message = action.payload.message;
      })
      .addCase(getNews.rejected, (state, action) => {
        state.status = "fail";
        state.message = null;
        state.error = action.error.message || null;
      });
  },
});

export default dataSlice.reducer;
