import { createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "../../services/payment/paymentService";
import handleError from "../../utils/common/handleError";

export const createCheckout = createAsyncThunk<
  { url: string },
  {
    title: string;
    credits: number;
  },
  { rejectValue: { message: string } }
>("storage/createCheckout", async ({ title, credits }, { rejectWithValue }) => {
  try {
    const response = await paymentService.createCheckout(title, credits);
    return response;
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "creating the checkout session"
    );
  }
});
