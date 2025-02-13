import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { getUploadDir } from "../common/getUploadDir";

const uploadDir = getUploadDir();

export const convertMp3ToWav = async (mp3Buffer: Buffer): Promise<Buffer> => {
  const tempMp3Path = path.join(uploadDir, "temp_audio.mp3");
  const tempWavPath = path.join(uploadDir, "temp_audio.wav");

  fs.writeFileSync(tempMp3Path, mp3Buffer);

  return new Promise((resolve, reject) => {
    exec(`ffmpeg -i ${tempMp3Path} ${tempWavPath}`, (err, stdout, stderr) => {
      if (err) {
        reject(new Error("Error converting MP3 to WAV"));
      } else {
        const wavBuffer = fs.readFileSync(tempWavPath);
        fs.unlinkSync(tempMp3Path);
        fs.unlinkSync(tempWavPath);
        resolve(wavBuffer);
      }
    });
  });
};
