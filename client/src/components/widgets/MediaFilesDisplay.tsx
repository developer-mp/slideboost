import { getFileIcon } from "../../utils/ppt/getFileIcon";
import { truncateText } from "../../utils/common/truncateText";
import { getFileSize } from "../../utils/ppt/getFileSize";
import { FileDetailProps } from "../../interfaces/interfaces";
import { FiTrash2 } from "react-icons/fi";

interface FileListDisplayProps {
  mediaFiles: FileDetailProps[];
  showSize?: boolean;
  showDate?: boolean;
  showCheckbox?: boolean;
  selectedMediaFiles?: FileDetailProps[];
  onSelect?: (selectedFiles: FileDetailProps[]) => void;
  setMediaFiles?: React.Dispatch<React.SetStateAction<FileDetailProps[]>>;
  showRemoveButton?: boolean;
  removeButtonPosition?: "margin-left";
}

const MediaFilesDisplay: React.FC<FileListDisplayProps> = ({
  mediaFiles,
  showSize = true,
  showDate = true,
  showCheckbox = false,
  selectedMediaFiles = [],
  onSelect,
  setMediaFiles,
  showRemoveButton = true,
  removeButtonPosition,
}) => {
  const handleFileSelection = (file: FileDetailProps) => {
    const isSelected = selectedMediaFiles.some((f) => f.id === file.id);
    const newSelectedFiles = isSelected
      ? selectedMediaFiles.filter((f) => f.id !== file.id)
      : [...selectedMediaFiles, file];

    onSelect?.(newSelectedFiles);
  };

  const removeFile = (index: number) => {
    setMediaFiles?.((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="tw-mt-3">
      {mediaFiles.map((file, index) => (
        <div
          key={index}
          className={`tw-flex tw-items-center ${
            removeButtonPosition === "margin-left" ? "" : "tw-justify-between"
          }`}
        >
          <div className="tw-flex tw-items-center">
            {showCheckbox && (
              <input
                type="checkbox"
                className="tw-mr-2 tw-w-4 tw-h-4 tw-accent-[#8b3dff]"
                checked={selectedMediaFiles.some((f) => f.id === file.id)}
                onChange={() => handleFileSelection(file)}
              />
            )}
            {getFileIcon(file.type)}
            <div className="tw-ml-2 tw-flex tw-flex-col">
              <div className="tw-font-bold">{file.name}</div>
              <div className="tw-flex tw-justify-between tw-text-gray-500">
                <div>{truncateText(file.type)}</div>
                {showSize && (
                  <div className="tw-ml-3">{getFileSize(file.size)}</div>
                )}
                {showDate && <div className="tw-ml-3">{file.date}</div>}
              </div>
            </div>
          </div>
          {showRemoveButton && (
            <div>
              <button
                onClick={() => removeFile(index)}
                className={`tw-text-[#FD4958] hover:tw-text-[#DB142B] tw-text-xl ${
                  removeButtonPosition === "margin-left"
                    ? "tw-ml-16"
                    : "tw-justify-between"
                }`}
              >
                <FiTrash2 />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaFilesDisplay;
