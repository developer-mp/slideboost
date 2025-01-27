import { createSlice } from "@reduxjs/toolkit";
import { TemplateCategory } from "../../interfaces/interfaces";
import { getTemplateCategories } from "../actions/dataAction";

interface DataState {
  templateCategories: TemplateCategory[];
  isFetched: boolean;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  message: string | null;
}

const initialState: DataState = {
  templateCategories: [],
  isFetched: false,
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
        state.isFetched = true;
        state.message = action.payload.message;
      })
      .addCase(getTemplateCategories.rejected, (state, action) => {
        state.status = "fail";
        state.message = null;
        state.error = action.error.message || null;
      });
  },
});

export default dataSlice.reducer;
