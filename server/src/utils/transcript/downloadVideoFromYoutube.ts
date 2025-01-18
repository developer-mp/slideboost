import path from "path";
import youtubedl from "youtube-dl-exec";

const uploadDir = path.join(__dirname, "..", "upload");

export const downloadVideoFromYoutube = async (
  filePath: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const outputFileName = "downloaded_video.mp4";
    const outputFilePath = path.join(uploadDir, outputFileName);

    const download = youtubedl.exec(filePath, {
      format: "best",
      output: outputFilePath,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });

    download.on("close", (code) => {
      if (code === 0) {
        resolve(outputFilePath);
      } else {
        reject(new Error("Failed to download video"));
      }
    });

    download.on("error", (err) => {
      console.error("Error during download:", err);
      reject(err);
    });
  });
};
