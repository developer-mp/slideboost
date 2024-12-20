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
};

export default handleError;
