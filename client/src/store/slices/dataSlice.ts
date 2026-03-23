import { createSlice } from "@reduxjs/toolkit";
import {
  DeactivationReason,
  SupportedFiles,
  Faq,
  News,
  TemplateCategory,
} from "../../interfaces/interfaces";
import { appApi } from "../api/appApi";

interface DataState {
  templateCategories: TemplateCategory[];
  deactivationReasons: DeactivationReason[];
  supportedFiles: SupportedFiles[];
  faq: Faq[];
  news: News[];
  isCategoriesFetched: boolean;
  isReasonsFetched: boolean;
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
      .addMatcher(
        appApi.endpoints.getTemplateCategories.matchPending,
        (state) => {
          state.status = "loading";
          state.message = null;
          state.error = null;
        },
      )
      .addMatcher(
        appApi.endpoints.getTemplateCategories.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.templateCategories = action.payload.data;
          state.isCategoriesFetched = true;
          state.message = action.payload.message;
        },
      )
      .addMatcher(
        appApi.endpoints.getTemplateCategories.matchRejected,
        (state, action) => {
          state.status = "fail";
          state.message = null;
          state.error = (action.error as { message?: string })?.message || null;
        },
      )
      .addMatcher(
        appApi.endpoints.getDeactivationReasons.matchPending,
        (state) => {
          state.status = "loading";
          state.message = null;
          state.error = null;
        },
      )
      .addMatcher(
        appApi.endpoints.getDeactivationReasons.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.deactivationReasons = action.payload.data;
          state.isReasonsFetched = true;
          state.message = action.payload.message;
        },
      )
      .addMatcher(
        appApi.endpoints.getDeactivationReasons.matchRejected,
        (state, action) => {
          state.status = "fail";
          state.message = null;
          state.error = (action.error as { message?: string })?.message || null;
        },
      )
      .addMatcher(appApi.endpoints.getSupportedFiles.matchPending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addMatcher(
        appApi.endpoints.getSupportedFiles.matchFulfilled,
        (state, action) => {
          state.status = "success";
          state.supportedFiles = action.payload.data;
          state.message = action.payload.message;
        },
      )
      .addMatcher(
        appApi.endpoints.getSupportedFiles.matchRejected,
        (state, action) => {
          state.status = "fail";
          state.message = null;
          state.error = (action.error as { message?: string })?.message || null;
        },
      )
      .addMatcher(appApi.endpoints.getFaq.matchPending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addMatcher(appApi.endpoints.getFaq.matchFulfilled, (state, action) => {
        state.status = "success";
        state.faq = action.payload.data;
        state.message = action.payload.message;
      })
      .addMatcher(appApi.endpoints.getFaq.matchRejected, (state, action) => {
        state.status = "fail";
        state.message = null;
        state.error = (action.error as { message?: string })?.message || null;
      })
      .addMatcher(appApi.endpoints.getNews.matchPending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addMatcher(appApi.endpoints.getNews.matchFulfilled, (state, action) => {
        state.status = "success";
        state.news = action.payload.data;
        state.message = action.payload.message;
      })
      .addMatcher(appApi.endpoints.getNews.matchRejected, (state, action) => {
        state.status = "fail";
        state.message = null;
        state.error = (action.error as { message?: string })?.message || null;
      });
  },
});

export default dataSlice.reducer;
