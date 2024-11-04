import Express from "express";
import TranscriptController from "./transcriptController";

const transcriptRouter = Express.Router();

transcriptRouter.post("/imgtotxt", TranscriptController.convertImageToText);
transcriptRouter.post("/audiototxt", TranscriptController.convertAudioToText);

export default transcriptRouter;
