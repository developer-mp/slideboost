import Express from "express";
import TranscriptController from "./transcriptController";

const transcriptRouter = Express.Router();

transcriptRouter.post("/texttotxt", TranscriptController.convertTextToText);
transcriptRouter.post("/imgtotxt", TranscriptController.convertImageToText);
transcriptRouter.post("/audiototxt", TranscriptController.convertAudioToText);
transcriptRouter.post("/videototxt", TranscriptController.convertVideoToText);
transcriptRouter.post(
  "/youtubetotxt",
  TranscriptController.convertYoutubeToText
);

export default transcriptRouter;
