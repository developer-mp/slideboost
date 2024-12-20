import { AxiosError } from "axios";

const handleError = {
  serviceError(error: unknown, context: string): void {
    if (error instanceof Error) {
      console.error(`An error occurred while ${context}: ${error.message}`);
    } else {
      console.error(`An unknown error occurred while ${context}: `, error);
    }
  },

  apiError(error: unknown): string {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("An API error occurred:", errorMessage);
      return errorMessage;
    } else if (error instanceof Error) {
      console.error("An unknown API error occurred: ", error.message);
      return error.message;
    }
    console.error("An unknown API error occurred");
    throw new Error("An unknown API error occurred");
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionError(error: unknown, rejectWithValue: any, actionName: string) {
    this.serviceError(error, actionName);

    if (error instanceof Error) {
      return rejectWithValue({
        message: error.message,
      });
    }

    return rejectWithValue({
      message: `An unknown error occurred while ${actionName}`,
    });
  },
};

export default handleError;
