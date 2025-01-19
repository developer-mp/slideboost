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
import { templatesCategories } from "../../data/templatesCategories";

const UploadFilesDisplay: React.FC<FileListDisplayProps> = ({
  fileDetails,
  showSize = true,
  showCategory = false,
  showCheckbox = false,
  selectedFiles = [],
  onSelect,
  setFileDetails,
  showRemoveButton = true,
  removeButtonPosition,
  onCategoryChange,
}) => {
  const handleFileSelection = (file: FileDetailProps) => {
    const isSelected = selectedFiles.some((f) => f.file_id === file.file_id);
    const newSelectedFiles = isSelected
      ? selectedFiles.filter((f) => f.file_id !== file.file_id)
      : [...selectedFiles, file];

    onSelect?.(newSelectedFiles);
  };

  const [selectedTemplateCategory, setSelectedTemplateCategory] =
    useState<string>("Select Category");

  const options = [
    ...templatesCategories.map((category) => ({
      id: category.id,
      label: category.category,
    })),
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedTemplateCategory(category);
    onCategoryChange?.(category);
  };

  const removeFile = (index: number) => {
    console.log(index);
    setFileDetails?.((prevFiles) => prevFiles.filter((_, i) => i !== index));
    console.log(fileDetails);
  };

  return (
    <div className="tw-mt-3">
      {fileDetails.map((file, index) => (
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
                checked={selectedFiles.some((f) => f.file_id === file.file_id)}
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
              </div>
            </div>
            {showCategory && (
              <div className="tw-ml-3">
                <CustomDropdown
                  options={options}
                  selectedOption={selectedTemplateCategory}
                  onOptionChange={handleCategoryChange}
                />
              </div>
            )}
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

export default UploadFilesDisplay;
