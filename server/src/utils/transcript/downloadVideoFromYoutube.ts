// import path from "path";
// import youtubedl from "youtube-dl-exec";
// import { getUploadDir } from "../common/getUploadDir";

// const uploadDir = getUploadDir();

// export const downloadVideoFromYoutube = async (
//   filePath: string
// ): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const outputFileName = "downloaded_video.mp4";
//     const outputFilePath = path.join(uploadDir, outputFileName);

//     const download = youtubedl.exec(filePath, {
//       format: "best",
//       output: outputFilePath,
//       addHeader: ["referer:youtube.com", "user-agent:googlebot"],
//     });

//     download.on("close", (code) => {
//       if (code === 0) {
//         resolve(outputFilePath);
//       } else {
//         reject(new Error("Failed to download video"));
//       }
//     });

//     download.on("error", (err) => {
//       console.error("Error during download:", err);
//       reject(err);
//     });
//   });
// };
