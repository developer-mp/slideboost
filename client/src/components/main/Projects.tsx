import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FileTable from "../shared/FileTable";
import { FileDetailProps } from "../../interfaces/interfaces";
import { getFileSize } from "../../utils/ppt/getFileSize";

const Projects: React.FC = () => {
  const [files, setFiles] = useState<FileDetailProps[]>([]);

  useEffect(() => {
    const existingFilesString = localStorage.getItem("ppt");
    const existingFiles = existingFilesString
      ? JSON.parse(existingFilesString)
      : [];
    setFiles(existingFiles);
  }, []);

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    localStorage.setItem("ppt", JSON.stringify(updatedFiles));
  };

  const downloadFile = (file: FileDetailProps) => {
    console.log("Download clicked: " + file.path);
  };

  const columns = [
    {
      key: "filename",
      label: "Filename",
      render: (file: FileDetailProps) => file.name,
    },
    {
      key: "size",
      label: "Size",
      render: (file: FileDetailProps) => getFileSize(file.size),
    },
    {
      key: "date",
      label: "Date Uploaded",
      render: (file: FileDetailProps) => file.date,
    },
  ];

  return (
    <Container className="tw-w-full">
      <div className="tw-mx-6 tw-my-6">
        <h2 className="tw-text-lg tw-font-bold tw-mb-4 tw-text-gray-900">
          Project List
        </h2>
        <div className="tw-bg-white tw-rounded-lg tw-p-5">
          <Row>
            <Col>
              <FileTable
                columns={columns}
                files={files}
                removeFile={removeFile}
                downloadFile={downloadFile}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default Projects;
