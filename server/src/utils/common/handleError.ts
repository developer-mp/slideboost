import axios from "axios";
import { Response } from "express";

const handleError = {
  controllerError(res: Response, error: unknown, context: string): void {
    if (error instanceof Error) {
      console.error(`An error occurred while ${context}: ${error.message}`);
      res.status(500).json({
        message: error.message,
      });
    } else {
      console.error(`An unknown error occurred while ${context}: `, error);
      res.status(500).json({
        message: `An error occurred while ${context}`,
      });
    }
  },

  serviceError(error: unknown, context: string): void {
    if (error instanceof Error) {
      console.error(`An error occurred while ${context}: ${error.message}`);
    } else {
      console.error(`An unknown error occurred while ${context}: `, error);
    }
    throw new Error(`An error occurred while ${context}`);
  },

  axiosError(
    error: unknown,
    context: string
  ): { message: string; requestCode?: boolean } {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const requestCode = error.response?.data?.requestCode || false;
      console.error(`An error occurred while ${context}: `, errorMessage);
      return { message: errorMessage, requestCode };
    } else if (error instanceof Error) {
      console.error(
        `An unknown error occurred while ${context}: `,
        error.message
      );
      return { message: error.message };
    }
    console.error("An unknown error occurred");
    throw new Error("An unknown error occurred");
  },
};

export default handleError;
