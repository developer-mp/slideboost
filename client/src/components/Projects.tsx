import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FileTable from "./FileTable";
import { FileDetail } from "../interfaces/interfaces";
import { getFileSize } from "../utils/ppt/getFileSize";

const Projects: React.FC = () => {
  const [files, setFiles] = useState<FileDetail[]>([]);

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

  const downloadFile = (file: FileDetail) => {
    console.log("Download clicked: " + file.path);
  };

  const columns = [
    {
      key: "filename",
      label: "Filename",
      render: (file: FileDetail) => file.name,
    },
    {
      key: "size",
      label: "Size",
      render: (file: FileDetail) => getFileSize(file.size),
    },
    {
      key: "date",
      label: "Date Uploaded",
      render: (file: FileDetail) => file.date,
    },
  ];

  return (
    <Container className="tw-w-full">
      <div className="tw-mx-6 tw-my-6">
        <h2 className="tw-text-lg tw-font-bold tw-mb-4">Project List</h2>
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
