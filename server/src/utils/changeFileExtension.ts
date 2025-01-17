import path from "path";

export const changeFileExtension = (
  filePath: string,
  newExtension: string
): string => {
  const parsedPath = path.parse(filePath);
  const newFilePath = path.format({
    dir: parsedPath.dir,
    name: parsedPath.name,
    ext: newExtension,
  });
  return newFilePath;
};
