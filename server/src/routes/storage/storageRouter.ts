import Express from "express";
import storageController from "./storageController";
import upload from "../../utils/createMemoryStorage";

const storageRouter = Express.Router();

storageRouter.post(
  "/upload",
  upload.single("file"),
  storageController.uploadFileToStorage
);

export default storageRouter;
