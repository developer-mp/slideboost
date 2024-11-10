import ffmpeg from "fluent-ffmpeg";

export const convertMp3ToWav = (
  mp3FilePath: string,
  wavFilePath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(mp3FilePath)
      .toFormat("wav")
      .audioChannels(1)
      .audioFrequency(16000)
      .on("end", () => resolve())
      .on("error", (err) => {
        console.error("Error converting audio:", err);
        reject(err);
      })
      .save(wavFilePath);
  });
};
