import { FiFileText, FiLink } from "react-icons/fi";
import {
  FaRegFileVideo,
  FaRegFileAudio,
  FaRegFileImage,
  FaRegFilePowerpoint,
} from "react-icons/fa";

export const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) {
    return <FaRegFileImage className="icon-size" />;
  }
  if (fileType.startsWith("video/")) {
    return <FaRegFileVideo className="icon-size" />;
  }
  if (fileType.startsWith("audio/")) {
    return <FaRegFileAudio className="icon-size" />;
  }
  if (fileType.startsWith("text/")) {
    return <FiFileText className="icon-size" />;
  }
  if (
    fileType === "application/vnd.ms-powerpoint" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return <FaRegFilePowerpoint className="icon-size" />;
  }
  return <FiLink className="icon-size" />;
};
