import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { Button, Col, Container, Row } from "react-bootstrap";
import CustomModal from "../shared/CustomModal";
import FileUploader from "../shared/FileUploader";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../utils/common/handleToast";
import { FileDetailProps, FileUploaderRef } from "../../interfaces/interfaces";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../../utils/common/handleActionMessage";
import { uploadFile } from "../../store/actions/storageAction";
import FileTable from "../shared/FileTable";
import { getFileSize } from "../../utils/ppt/getFileSize";
import { truncateText } from "../../utils/common/truncateText";

const MediaMenu: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const fileUploaderRef = useRef<FileUploaderRef>(null);

  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.userId);
  const fileMetadata = useSelector(
    (state: RootState) => state.fileStorage.fileMetadata
  );

  const handleUpload = async (file: File[]) => {
    try {
      const resultAction = await dispatch(
        uploadFile({ file, userId })
      ).unwrap();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while uploading the file to the storage: ",
        error
      );
    }
  };

  const columns = [
    {
      key: "name",
      label: "File Name",
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
      key: "uploaded_at",
      label: "Uploaded At",
      render: (file: FileDetailProps) =>
        new Date(file.uploaded_at).toLocaleString(),
    },
  ];

  const removeFile = (index: number) => {
    try {
      const updatedFiles = fileMetadata.filter((_, i) => i !== index);
      showSuccessToast("File deleted successfully");
    } catch (error) {
      console.log("Error deleting file: ", error);
      showErrorToast("Error deleting file");
    }
  };

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
                files={fileMetadata}
                removeFile={removeFile}
                downloadFile={() => {}}
                selectedFolder="media"
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
          handleUpload(filesToUpload);
          setShowModal(false);
        }}
      >
        <FileUploader ref={fileUploaderRef} onUpload={handleUpload} />
      </CustomModal>
    </Container>
  );
};

export default MediaMenu;
