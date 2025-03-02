import { createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "../../services/payment/paymentService";
import handleError from "../../utils/common/handleError";

export const createCheckout = createAsyncThunk<
  { url: string },
  {
    amount: number;
  },
  { rejectValue: { message: string } }
>("payment/createCheckout", async ({ amount }, { rejectWithValue }) => {
  try {
    const response = await paymentService.createCheckout(amount);
    return response;
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "creating the checkout session"
    );
  }
});
