import path from "path";

export const getUploadDir = () => {
  return path.join(__dirname, "..", "..", "upload");
};
