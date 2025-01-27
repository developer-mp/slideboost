export const replaceExtension = (fileUrl: string): string => {
  if (fileUrl && (fileUrl.endsWith(".ppt") || fileUrl.endsWith(".pptx"))) {
    return fileUrl.replace(/\.pptx?$/, ".png");
  }

  return "";
};
