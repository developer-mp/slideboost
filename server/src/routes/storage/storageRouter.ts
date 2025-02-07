import Express from "express";
import storageController from "./storageController";
import upload from "../../utils/storage/createMemoryStorage";

const storageRouter = Express.Router();

storageRouter.post(
  "/upload",
  upload.single("file"),
  storageController.uploadFileToStorage
);
storageRouter.get("/metadata", storageController.getFileMetadata);
storageRouter.post("/delete", storageController.deleteFileFromStorage);
storageRouter.get("/download", storageController.downloadFileFromStorage);

export default storageRouter;
