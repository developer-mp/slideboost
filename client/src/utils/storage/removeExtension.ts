export const removeExtension = (fileName: string): string => {
  return fileName.replace(/\.[^/.]+$/, "");
};
