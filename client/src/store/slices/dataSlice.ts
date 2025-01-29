import { createSlice } from "@reduxjs/toolkit";
import {
  DeactivationReason,
  Faq,
  News,
  TemplateCategory,
} from "../../interfaces/interfaces";
import {
  getTemplateCategories,
  getDeactivationReasons,
  getFaq,
  getNews,
} from "../actions/dataAction";

interface DataState {
  templateCategories: TemplateCategory[];
  deactivationReasons: DeactivationReason[];
  faq: Faq[];
  news: News[];
  isFetchedCategories: boolean;
  isFetchedReasons: boolean;
  isFetchedFaq: boolean;
  isFetchedNews: boolean;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  message: string | null;
}

const initialState: DataState = {
  templateCategories: [],
  deactivationReasons: [],
  faq: [],
  news: [],
  isFetchedCategories: false,
  isFetchedReasons: false,
  isFetchedFaq: false,
  isFetchedNews: false,
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
        state.isFetchedCategories = true;
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
        state.isFetchedReasons = true;
        state.message = action.payload.message;
      })
      .addCase(getDeactivationReasons.rejected, (state, action) => {
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
        state.isFetchedFaq = true;
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
        state.isFetchedNews = true;
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
