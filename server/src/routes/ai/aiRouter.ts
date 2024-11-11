import Express from "express";
import AiController from "./aiController";

const aiRouter = Express.Router();

aiRouter.post("/transcript", AiController.formatTranscript);

export default aiRouter;
