import { FileDetail } from "../../interfaces/interfaces";

export const handleFileUpload = (
  files: FileDetail[],
  localStorageKey: string
) => {
  const key = localStorageKey;

  const existingFilesString = localStorage.getItem(key);
  const existingFiles = existingFilesString
    ? JSON.parse(existingFilesString)
    : [];

  const updatedFiles = [...existingFiles, ...files];

  try {
    localStorage.setItem(key, JSON.stringify(updatedFiles));
  } catch (error) {
    console.error(`Failed to update localStorage for key: ${key}`, error);
  }
};
