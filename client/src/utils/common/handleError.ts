import axios from "axios";

const handleError = {
  axiosError(error: unknown, context: string): string {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error(`An error occurred while ${context}: `, errorMessage);
      return errorMessage;
    } else if (error instanceof Error) {
      console.error(
        `An unknown error occurred while ${context}: `,
        error.message
      );
      return error.message;
    }
    console.error("An unknown error occurred");
    throw new Error("An unknown error occurred");
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionError(error: unknown, rejectWithValue: any, actionName: string) {
    if (axios.isAxiosError(error)) {
      const message = this.axiosError(error, actionName);
      return rejectWithValue({ message });
    }

    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }

    return rejectWithValue({
      message: `An unknown error occurred while ${actionName}`,
    });
  },
};

export default handleError;
