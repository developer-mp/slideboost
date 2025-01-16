import { FC, useState } from "react";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { FileDetailProps, FileTableProps } from "../../interfaces/interfaces";
import { FiTrash2, FiDownload } from "react-icons/fi";

const FileTable: FC<FileTableProps> = ({
  columns,
  files,
  removeFile,
  downloadFile,
  selectedFolder,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  const filteredFiles = files.filter((file) => file.folder === selectedFolder);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortArrow = (key: string) => {
    if (sortConfig && sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <IoIosArrowRoundUp className="tw-ml-1" />
      ) : (
        <IoIosArrowRoundDown className="tw-ml-1" />
      );
    }
    return <IoIosArrowRoundDown className="tw-ml-1" />;
  };

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    const aValue = a[key as keyof FileDetailProps] ?? "";
    const bValue = b[key as keyof FileDetailProps] ?? "";

    if (aValue < bValue) return direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return direction === "ascending" ? 1 : -1;
    return 0;
  });

  return (
    <table className="tw-w-full tw-border-collapse">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className="tw-p-2 tw-text-left tw-border-b-[1px] tw-border-gray-300 tw-text-gray-500 tw-cursor-pointer"
              onClick={() => requestSort(column.key)}
            >
              <div className="tw-flex tw-items-center">
                <span>{column.label}</span>
                {getSortArrow(column.key)}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedFiles.map((file, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.key} className="tw-p-3">
                {column.render(file)}
              </td>
            ))}
            <td className="tw-p-2 tw-text-center tw-flex tw-justify-center tw-items-center">
              {downloadFile && file.path && (
                <button
                  onClick={() => downloadFile(file)}
                  className="tw-text-[#4CAF50] hover:tw-text-[#388E3C] tw-text-xl tw-flex tw-items-center tw-justify-center tw-h-full"
                >
                  <FiDownload />
                </button>
              )}
              <button
                onClick={() => removeFile(index)}
                className="tw-text-[#FD4958] hover:tw-text-[#DB142B] tw-text-xl tw-flex tw-items-center tw-justify-center tw-ml-4"
              >
                <FiTrash2 />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FileTable;
