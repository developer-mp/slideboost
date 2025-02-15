import fs from "fs";
import { spawn } from "child_process";
import path from "path";
import { getUploadDir } from "../common/getUploadDir";

const uploadDir = getUploadDir();

export const extractAudioFromVideo = async (
  videoBuffer: Buffer
): Promise<Buffer> => {
  const tempVideoPath = path.join(uploadDir, "temp_video.mp4");
  const tempAudioPath = path.join(uploadDir, "temp_audio.wav");

  fs.writeFileSync(tempVideoPath, videoBuffer);

  await new Promise<void>((resolve, reject) => {
    const ffmpegProcess = spawn("ffmpeg", [
      "-i",
      tempVideoPath,
      "-vn",
      "-acodec",
      "pcm_s16le",
      "-ar",
      "16000",
      "-ac",
      "1",
      tempAudioPath,
    ]);

    ffmpegProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error("FFmpeg audio extraction failed"));
      } else {
        resolve();
      }
    });

    ffmpegProcess.on("error", (err) => {
      reject(err);
    });
  });

  const audioBuffer = fs.readFileSync(tempAudioPath);

  fs.unlinkSync(tempVideoPath);
  fs.unlinkSync(tempAudioPath);

  return audioBuffer;
};
