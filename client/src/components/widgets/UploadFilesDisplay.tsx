import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getFileIcon } from "../../utils/ppt/getFileIcon";
import { truncateText } from "../../utils/common/truncateText";
import { getFileSize } from "../../utils/ppt/getFileSize";
import { FileListDisplayProps } from "../../interfaces/interfaces";
import { FiTrash2 } from "react-icons/fi";
import CustomDropdown from "../shared/CustomDropdown";
import { getTemplateCategories } from "../../store/actions/dataAction";
import { handleErrorMessage } from "../../utils/common/handleActionMessage";
import { showErrorToast } from "../../utils/common/handleToast";

const UploadFilesDisplay: React.FC<FileListDisplayProps> = ({
  files,
  showCategory = false,
  setFiles,
  onCategoryChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { templateCategories, isCategoriesFetched } = useSelector(
    (state: RootState) => state.dataStorage
  );

  const handleTemplateCategories = async () => {
    try {
      await dispatch(getTemplateCategories()).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while fetching the template categories: ",
        error
      );
    }
  };

  useEffect(() => {
    if (!isCategoriesFetched) {
      handleTemplateCategories();
    }
  });

  const options = [
    { id: "all", label: "All Categories" },
    ...templateCategories.map((category) => ({
      id: category.id,
      label: category.category_name,
    })),
  ];

  const handleCategoryChange = (category: string, index: number) => {
    onCategoryChange?.(category, index);
  };

  const removeFile = (index: number) => {
    setFiles?.((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="tw-mt-3">
      {files.map((file, index) => (
        <div key={index} className="tw-flex tw-items-center tw-justify-between">
          <div className="tw-flex tw-items-center">
            {getFileIcon(file.file.type)}
            <div className="tw-ml-2 tw-flex tw-flex-col">
              <div className="tw-font-bold">{file.file.name}</div>
              <div className="tw-flex tw-justify-between tw-text-gray-500">
                <div>{truncateText(file.file.type, 30)}</div>

                <div className="tw-ml-3">{getFileSize(file.file.size)}</div>
              </div>
            </div>
            {showCategory && (
              <div className="tw-ml-3">
                <CustomDropdown
                  options={options}
                  selectedOption={file.category || "Select Category"}
                  onOptionChange={(category) =>
                    handleCategoryChange(category, index)
                  }
                />
              </div>
            )}
          </div>
          <button
            onClick={() => removeFile(index)}
            className="tw-text-[#FD4958] hover:tw-text-[#DB142B] tw-text-xl tw-justify-between"
          >
            <FiTrash2 />
          </button>
        </div>
      ))}
    </div>
  );
};

export default UploadFilesDisplay;
