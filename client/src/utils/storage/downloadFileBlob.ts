export const downloadFileBlob = (
  fileData: number[],
  fileType: string,
  fileName: string
) => {
  const fileBlob = new Blob([new Uint8Array(fileData)], { type: fileType });
  const downloadUrl = URL.createObjectURL(fileBlob);

  const a = document.createElement("a");
  a.href = downloadUrl;
  if (fileName) a.download = fileName;
  a.click();
  URL.revokeObjectURL(downloadUrl);
};
