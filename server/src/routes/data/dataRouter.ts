import Express from "express";
import DataController from "./dataController";

const dataRouter = Express.Router();

dataRouter.get("/template-categories", DataController.getTemplateCategories);
dataRouter.get("/deactivation-reasons", DataController.getDeactivationReasons);
dataRouter.get("/supported-files", DataController.getSupportedFiles);
dataRouter.get("/faq", DataController.getFaq);
dataRouter.get("/news", DataController.getNews);

export default dataRouter;
