import { FiFileText, FiFile } from "react-icons/fi";
import {
  FaRegFileVideo,
  FaRegFileAudio,
  FaRegFileImage,
  FaRegFilePowerpoint,
} from "react-icons/fa";

export const getFileIcon = (fileType: string) => {
  const fileCategory = fileType.split("/")[0].toLowerCase();
  const fileFormat = fileType.split("/")[1].toLowerCase();
  if (fileCategory === "image") {
    return <FaRegFileImage className="icon-size" />;
  }
  if (fileCategory === "video") {
    return <FaRegFileVideo className="icon-size" />;
  }
  if (fileCategory === "audio") {
    return <FaRegFileAudio className="icon-size" />;
  }
  if (fileCategory === "text") {
    return <FiFileText className="icon-size" />;
  }
  if (fileCategory === "application") {
    if (
      fileFormat ===
        "vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileFormat == "pdf"
    ) {
      return <FiFileText className="icon-size" />;
    }
    if (
      fileFormat === "vnd.ms-powerpoint" ||
      fileFormat ===
        "vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return <FaRegFilePowerpoint className="icon-size" />;
    }
  }

  return <FiFile className="icon-size" />;
};
