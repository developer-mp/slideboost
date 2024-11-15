import { useState, useRef, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import CustomModal from "./CustomModal";
import FileUploader from "./FileUploader";
import { FileUploaderRef, FileDetail } from "../interfaces/interfaces";
import { handleFileUpload } from "../utils/ppt/handleFileUpload";
import { getFileSize } from "../utils/ppt/getFileSize";
import FileTable from "./FileTable";
import { truncateText } from "../utils/common/truncateText";

const MediaMenu: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState<FileDetail[]>([]);
  const fileUploaderRef = useRef<FileUploaderRef>(null);

  useEffect(() => {
    const existingFilesString = localStorage.getItem("mediaDetails");
    const existingFiles = existingFilesString
      ? JSON.parse(existingFilesString)
      : [];
    setFiles(existingFiles);
  }, []);

  const handleUpload = (files: FileDetail[]) => {
    handleFileUpload(files, "mediaDetails");
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    localStorage.setItem("mediaDetails", JSON.stringify(updatedFiles));
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
      key: "type",
      label: "Type",
      render: (file: FileDetail) => truncateText(file.type),
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
        <Button
          className="button button-primary tw-my-4"
          onClick={() => setShowModal(true)}
        >
          Add Media
        </Button>
        <h2 className="tw-text-lg tw-font-bold tw-mb-4">Media Content</h2>
        <div className="tw-bg-white tw-rounded-lg tw-p-5">
          <Row>
            <Col>
              <FileTable
                columns={columns}
                files={files}
                removeFile={removeFile}
              />
            </Col>
          </Row>
        </div>
      </div>
      <CustomModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        title="Upload Media"
        actionLabel="Upload"
        onAction={() => {
          const filesToUpload = fileUploaderRef.current?.getFileDetails();
          if (filesToUpload) {
            handleUpload(filesToUpload);
            setShowModal(false);
          }
        }}
      >
        <FileUploader
          ref={fileUploaderRef}
          onUpload={handleUpload}
          isTemplate={false}
        />
      </CustomModal>
    </Container>
  );
};

export default MediaMenu;
