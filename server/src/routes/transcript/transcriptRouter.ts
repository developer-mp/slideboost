import Express from "express";
import TranscriptController from "./transcriptController";

const transcriptRouter = Express.Router();

transcriptRouter.post("/text-to-txt", TranscriptController.convertTextToText);
transcriptRouter.post("/img-to-txt", TranscriptController.convertImageToText);
transcriptRouter.post("/audio-to-txt", TranscriptController.convertAudioToText);
transcriptRouter.post("/video-to-txt", TranscriptController.convertVideoToText);
transcriptRouter.post(
  "/youtube-to-txt",
  TranscriptController.convertYoutubeToText
);

export default transcriptRouter;
