export const getFileSize = (fileSize: number) => {
  if (fileSize > 1024 * 1024) {
    return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(fileSize / 1024).toFixed(2)} KB`;
  }
};
