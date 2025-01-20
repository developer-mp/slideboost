// import { useState } from "react";
// import { getFileIcon } from "../../utils/ppt/getFileIcon";
// import { truncateText } from "../../utils/common/truncateText";
// import { getFileSize } from "../../utils/ppt/getFileSize";
// import {
//   FileListDisplayProps,
//   // FileWithMetadata,
// } from "../../interfaces/interfaces";
// import { FiTrash2 } from "react-icons/fi";
// import CustomDropdown from "../shared/CustomDropdown";
// import { templatesCategories } from "../../data/templatesCategories";

// const UploadFilesDisplay: React.FC<FileListDisplayProps> = ({
//   fileDetails,
//   // showSize = true,
//   showCategory = false,
//   // showCheckbox = false,
//   // selectedFiles = [],
//   // onSelect,
//   setFileDetails,
//   // showRemoveButton = true,
//   // removeButtonPosition,
//   onCategoryChange,
// }) => {
//   // const handleFileSelection = (file: FileWithMetadata) => {
//   //   const isSelected = selectedFiles.some((f) => f.name === file.file.name);
//   //   const newSelectedFiles = isSelected
//   //     ? selectedFiles.filter((f) => f.name !== file.file.name)
//   //     : [...selectedFiles, file];

//   //   onSelect?.(newSelectedFiles);
//   // };

//   const [selectedTemplateCategory, setSelectedTemplateCategory] =
//     useState<string>("Select Category");

//   const options = [
//     ...templatesCategories.map((category) => ({
//       id: category.id,
//       label: category.category,
//     })),
//   ];

//   const handleCategoryChange = (category: string) => {
//     setSelectedTemplateCategory(category);
//     onCategoryChange?.(category);
//   };

//   const removeFile = (index: number) => {
//     console.log(index);
//     setFileDetails?.((prevFiles) => prevFiles.filter((_, i) => i !== index));
//     console.log(fileDetails);
//   };

//   return (
//     <div className="tw-mt-3">
//       {fileDetails.map((file, index) => (
//         <div
//           key={index}
//           className="tw-flex tw-items-center tw-justify-between"
//           // className={`tw-flex tw-items-center ${
//           //   removeButtonPosition === "margin-left" ? "" : "tw-justify-between"
//           // }`}
//         >
//           <div className="tw-flex tw-items-center">
//             {/* {showCheckbox && (
//               <input
//                 type="checkbox"
//                 className="tw-mr-2 tw-w-4 tw-h-4 tw-accent-[#8b3dff]"
//                 checked={selectedFiles.some((f) => f.file_id === file.file_id)}
//                 onChange={() => handleFileSelection(file)}
//               />
//             )} */}
//             {getFileIcon(file.type)}
//             <div className="tw-ml-2 tw-flex tw-flex-col">
//               <div className="tw-font-bold">{file.name}</div>
//               <div className="tw-flex tw-justify-between tw-text-gray-500">
//                 <div>{truncateText(file.type)}</div>
//                 {/* {showSize && ( */}
//                 <div className="tw-ml-3">{getFileSize(file.size)}</div>
//                 {/* )} */}
//               </div>
//             </div>
//             {showCategory && (
//               <div className="tw-ml-3">
//                 <CustomDropdown
//                   options={options}
//                   selectedOption={selectedTemplateCategory}
//                   onOptionChange={handleCategoryChange}
//                 />
//               </div>
//             )}
//           </div>
//           {/* {showRemoveButton && ( */}
//           <div>
//             <button
//               onClick={() => removeFile(index)}
//               className="tw-text-[#FD4958] hover:tw-text-[#DB142B] tw-text-xl tw-justify-between"
//               // className={`tw-text-[#FD4958] hover:tw-text-[#DB142B] tw-text-xl ${
//               //   removeButtonPosition === "margin-left"
//               //     ? "tw-ml-16"
//               //     : "tw-justify-between"
//               // }`}
//             >
//               <FiTrash2 />
//             </button>
//           </div>
//           {/* )} */}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default UploadFilesDisplay;

// import { useState } from "react";
import { getFileIcon } from "../../utils/ppt/getFileIcon";
import { truncateText } from "../../utils/common/truncateText";
import { getFileSize } from "../../utils/ppt/getFileSize";
import { FileListDisplayProps } from "../../interfaces/interfaces";
import { FiTrash2 } from "react-icons/fi";
import CustomDropdown from "../shared/CustomDropdown";
import { templatesCategories } from "../../data/templatesCategories";

const UploadFilesDisplay: React.FC<FileListDisplayProps> = ({
  files,
  showCategory = false,
  setFiles,
  onCategoryChange,
}) => {
  const options = [
    ...templatesCategories.map((category) => ({
      id: category.id,
      label: category.category,
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
                <div>{truncateText(file.file.type)}</div>

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
