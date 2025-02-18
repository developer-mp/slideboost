import Express from "express";
import pptController from "./pptController";

const pptRouter = Express.Router();

pptRouter.get("/count-tokens", pptController.calculateTokens);
pptRouter.get("/presentation", pptController.createPresentation);

export default pptRouter;
