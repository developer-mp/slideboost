import Express from "express";
import PptController from "./pptController";

const pptRouter = Express.Router();

pptRouter.post("/presentation", PptController.createPpt);

export default pptRouter;
