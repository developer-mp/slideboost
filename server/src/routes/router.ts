import { Application } from "express";
import userRouter from "./user/userRouter";
import storageRouter from "./storage/storageRouter";
import dataRouter from "./data/dataRouter";
import pptRouter from "./ppt/pptRouter";
import paymentRouter from "./payment/paymentRouter";

export const ServerRouter = {
  setRouter(app: Application): void {
    const apiVersion = "v1";
    app.use(`/api/${apiVersion}/user`, userRouter);
    app.use(`/api/${apiVersion}/storage`, storageRouter);
    app.use(`/api/${apiVersion}/data`, dataRouter);
    app.use(`/api/${apiVersion}/ppt`, pptRouter);
    app.use(`/api/${apiVersion}/payment`, paymentRouter);
  },
};
