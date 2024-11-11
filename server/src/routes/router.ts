import { Application } from "express";
import authRouter from "./auth/authRouter";
import transcriptRouter from "./transcript/transcriptRouter";
import aiRouter from "./ai/aiRouter";

export const ServerRouter = {
  setRouter(app: Application): void {
    const apiVersion = "v1";
    app.use(`/api/${apiVersion}/auth`, authRouter);
    app.use(`/api/${apiVersion}/transcript`, transcriptRouter);
    app.use(`/api/${apiVersion}/ai`, aiRouter);
  },
};
