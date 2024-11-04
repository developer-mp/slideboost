import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
} else {
  console.error("FFmpeg path is not set");
}

export const convertMp3ToWav = (
  mp3FilePath: string,
  wavFilePath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(mp3FilePath)
      .toFormat("wav")
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(wavFilePath);
  });
};
