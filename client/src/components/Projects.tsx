import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { FileDetail } from "../interfaces/interfaces";
import { getFileSize } from "../utils/getFileSize";

const Projects: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [files, setFiles] = useState<FileDetail[]>([]);

  useEffect(() => {
    const existingFilesString = localStorage.getItem("ppt");
    const existingFiles = existingFilesString
      ? JSON.parse(existingFilesString)
      : [];
    setFiles(existingFiles);
  }, []);

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

  return (
    <Container className="tw-w-full">
      <div className="tw-mx-6 tw-my-6">
        <h2 className="tw-text-lg tw-font-bold tw-mb-4">Project List</h2>
        <div className="tw-bg-white tw-rounded-lg tw-p-5">
          <Row>
            <Col>
              <table className="tw-w-full tw-border-collapse">
                <thead>
                  <tr>
                    <th
                      className="tw-p-2 tw-text-left tw-border-b-[1px] tw-border-gray-300 tw-text-gray-500 tw-cursor-pointer"
                      onClick={() => requestSort("filename")}
                    >
                      <div className="tw-flex tw-items-center">
                        <span>Filename</span>
                        {getSortArrow("filename")}
                      </div>
                    </th>
                    <th
                      className="tw-p-2 tw-text-left tw-border-b-[1px] tw-border-gray-300 tw-text-gray-500 tw-cursor-pointer"
                      onClick={() => requestSort("size")}
                    >
                      <div className="tw-flex tw-items-center">
                        <span>Size</span>
                        {getSortArrow("size")}
                      </div>
                    </th>
                    <th
                      className="tw-p-2 tw-text-left tw-border-b-[1px] tw-border-gray-300 tw-text-gray-500 tw-cursor-pointer"
                      onClick={() => requestSort("date")}
                    >
                      <div className="tw-flex tw-items-center">
                        <span>Date Uploaded</span>
                        {getSortArrow("date")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr key={index}>
                      <td style={{ padding: "10px" }}>{file.name}</td>
                      <td style={{ padding: "10px" }}>
                        {getFileSize(file.size)}
                      </td>
                      <td style={{ padding: "10px" }}>{file.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default Projects;
