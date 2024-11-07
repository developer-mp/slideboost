import fs from "fs";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";

export const extractWavFromYoutube = async (
  youtubeUrl: string,
  tempAudioPath: string,
  wavFilePath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audioStream = ytdl(youtubeUrl, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    audioStream.pipe(fs.createWriteStream(tempAudioPath));

    audioStream.on("end", () => {
      ffmpeg(tempAudioPath)
        .output(wavFilePath)
        .on("end", () => {
          fs.unlinkSync(tempAudioPath);
          resolve();
        })
        .on("error", (err) => {
          reject(new Error("FFmpeg conversion error: " + err.message));
        })
        .run();
    });

    audioStream.on("error", (err) => {
      reject(new Error("Audio download error: " + err.message));
    });
  });
};
