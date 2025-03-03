import { createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "../../services/payment/paymentService";
import handleError from "../../utils/common/handleError";

export const createCheckout = createAsyncThunk<
  { url: string },
  {
    amount: number;
    userId: string;
  },
  { rejectValue: { message: string } }
>("payment/createCheckout", async ({ amount, userId }, { rejectWithValue }) => {
  try {
    const response = await paymentService.createCheckout(amount, userId);
    return response;
  } catch (error) {
    return handleError.actionError(
      error,
      rejectWithValue,
      "creating the checkout session"
    );
  }
});

export const verifyPayment = createAsyncThunk<
  { paid: boolean; message: string },
  {
    sessionId: string;
    credits: number;
    userId: string;
  },
  { rejectValue: { message: string } }
>(
  "payment/verifyPayment",
  async ({ sessionId, credits, userId }, { rejectWithValue }) => {
    try {
      const response = await paymentService.verifyPayment(
        sessionId,
        credits,
        userId
      );
      return response;
    } catch (error) {
      return handleError.actionError(
        error,
        rejectWithValue,
        "verifying the payment"
      );
    }
  }
);
