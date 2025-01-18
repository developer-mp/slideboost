import ffmpeg from "fluent-ffmpeg";

export const extractWavFromVideo = (
  videoFilePath: string,
  wavFilePath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoFilePath)
      .output(wavFilePath)
      .audioCodec("pcm_s16le")
      .audioChannels(1)
      .audioFrequency(16000)
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
