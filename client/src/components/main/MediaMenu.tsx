import { useState, useRef, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import CustomModal from "../shared/CustomModal";
import FileUploader from "../shared/FileUploader";
import { FileUploaderRef, FileDetailProps } from "../../interfaces/interfaces";
import { handleFileUpload } from "../../utils/ppt/handleFileUpload";
import { getFileSize } from "../../utils/ppt/getFileSize";
import FileTable from "../shared/FileTable";
import { truncateText } from "../../utils/common/truncateText";
import {
  showErrorToast,
  showWarningToast,
  showSuccessToast,
} from "../../utils/common/handleToast";

const MediaMenu: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [files, setFiles] = useState<FileDetailProps[]>([]);
  const fileUploaderRef = useRef<FileUploaderRef>(null);

  useEffect(() => {
    const existingFilesString = localStorage.getItem("mediaDetails");
    const existingFiles = existingFilesString
      ? JSON.parse(existingFilesString)
      : [];
    setFiles(existingFiles);
  }, []);

  const handleUpload = (files: FileDetailProps[]) => {
    if (files && files.length > 0) {
      try {
        handleFileUpload(files, "mediaDetails");
        showSuccessToast("File uploaded successfully");
      } catch (error) {
        console.log("Error uploading file: ", error);
        showErrorToast("Error uploading file");
      }
    }
  };

  const removeFile = (index: number) => {
    try {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      localStorage.setItem("mediaDetails", JSON.stringify(updatedFiles));
      showSuccessToast("File deleted successfully");
    } catch (error) {
      console.log("Error deleting file:", error);
      showErrorToast("Error deleting file");
    }
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
      key: "type",
      label: "Type",
      render: (file: FileDetailProps) => truncateText(file.type),
    },
    {
      key: "date",
      label: "Date Uploaded",
      render: (file: FileDetailProps) => file.date,
    },
  ];

  return (
    <Container className="tw-w-full tw-overflow-hidden">
      <div className="tw-mx-6 tw-my-6">
        <h2 className="tw-text-lg tw-font-bold tw-text-gray-900">
          Media Content
        </h2>
        <Button
          className="button button-primary-auto tw-my-4"
          onClick={() => setShowModal(true)}
        >
          Add Media
        </Button>
        <div className="tw-bg-white tw-rounded-lg tw-p-5 tw-overflow-x-auto md:tw-overflow-x-visible">
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
          if (!filesToUpload || filesToUpload.length === 0) {
            showWarningToast("Please select files to upload");
            return;
          }
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
