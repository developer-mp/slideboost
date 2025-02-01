import { getFileIcon } from "../../utils/ppt/getFileIcon";
import { truncateText } from "../../utils/common/truncateText";
import {
  FileDetailProps,
  MediaFileDisplayProps,
} from "../../interfaces/interfaces";

const MediaFilesDisplay: React.FC<MediaFileDisplayProps> = ({
  mediaFiles,
  selectedMediaFiles = [],
  onSelect,
}) => {
  const handleFileSelection = (file: FileDetailProps) => {
    const isSelected = selectedMediaFiles.some(
      (f) => f.file_id === file.file_id
    );
    const newSelectedFiles = isSelected
      ? selectedMediaFiles.filter((f) => f.file_id !== file.file_id)
      : [...selectedMediaFiles, file];

    onSelect?.(newSelectedFiles);
  };

  return (
    <div className="tw-mt-3">
      {mediaFiles.map((file, index) => (
        <div
          key={index}
          className="tw-flex tw-items-center tw-justify-between tw-mb-1"
        >
          <div className="tw-flex tw-items-center">
            <input
              type="checkbox"
              className="tw-mr-2 tw-w-4 tw-h-4 tw-accent-[#5b4bad]"
              checked={selectedMediaFiles.some(
                (f) => f.file_id === file.file_id
              )}
              onChange={() => handleFileSelection(file)}
            />
            {getFileIcon(file.type)}
            <div className="tw-font-bold tw-ml-2">{file.name}</div>
            <div className="tw-flex tw-justify-between tw-text-gray-500 tw-ml-8">
              <div>{truncateText(file.type)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaFilesDisplay;
