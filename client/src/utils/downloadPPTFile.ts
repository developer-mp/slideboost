export const downloadPPTFile = (filePath: string, fileName: string) => {
  if (!filePath) {
    console.error("No PPT file path available");
    return;
  }
  const link = document.createElement("a");
  link.href = filePath;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
