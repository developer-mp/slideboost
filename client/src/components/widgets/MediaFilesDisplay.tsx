import { useState } from "react";
import { getFileIcon } from "../../utils/ppt/getFileIcon";
import { truncateText } from "../../utils/common/truncateText";
import { getFileSize } from "../../utils/ppt/getFileSize";
import {
  FileDetailProps,
  FileListDisplayProps,
} from "../../interfaces/interfaces";
import { FiTrash2 } from "react-icons/fi";
import CustomDropdown from "../shared/CustomDropdown";
// import { templatesCategories } from "../../data/templatesCategories";

const MediaFilesDisplay: React.FC<FileListDisplayProps> = ({
  mediaFiles,
  showSize = true,
  showDate = true,
  showCategory = false,
  showCheckbox = false,
  selectedMediaFiles = [],
  onSelect,
  setMediaFiles,
  showRemoveButton = true,
  removeButtonPosition,
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

  const [selectedCategory, setSelectedCategory] =
    useState<string>("Select Category");

  // const options = [
  //   ...templatesCategories.map((category) => ({
  //     id: category.id,
  //     label: category.category,
  //   })),
  // ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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
                checked={selectedMediaFiles.some(
                  (f) => f.file_id === file.file_id
                )}
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
                {showDate && <div className="tw-ml-3">{file.uploaded_at}</div>}
                {showCategory && (
                  <div className="tw-ml-3">
                    <CustomDropdown
                      options={options}
                      selectedOption={selectedCategory}
                      onOptionChange={handleCategoryChange}
                    />
                  </div>
                )}
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
