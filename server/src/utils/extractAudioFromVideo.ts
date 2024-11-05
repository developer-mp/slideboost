import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
} else {
  console.error("FFmpeg path is not set");
}

export const extractWavFromVideo = (
  videoFilePath: string,
  wavFilePath: string
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(videoFilePath)
      .output(wavFilePath)
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        console.error("Error extracting audio:", err);
        reject(err);
      })
      .run();
  });
};
