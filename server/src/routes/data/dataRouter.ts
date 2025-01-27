import Express from "express";
import DataController from "./dataController";

const dataRouter = Express.Router();

dataRouter.get("/templates", DataController.getTemplateCategories);

export default dataRouter;
