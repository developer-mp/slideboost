// import { FileUploaderRef } from "../../interfaces/interfaces";
// import { handleFileUpload } from "../../utils/ppt/handleFileUpload";
// import { getFileSize } from "../../utils/ppt/getFileSize";
// import FileTable from "../shared/FileTable";
// import { truncateText } from "../../utils/common/truncateText";

import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { Button, Col, Container, Row } from "react-bootstrap";
import CustomModal from "../shared/CustomModal";
import FileUploader from "../shared/FileUploader";
import {
  showErrorToast,
  showWarningToast,
  showSuccessToast,
} from "../../utils/common/handleToast";
import { FileUploaderRef } from "../../interfaces/interfaces";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../../utils/common/handleActionMessage";
import { uploadFile } from "../../store/actions/storageAction";

const MediaMenu: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const fileUploaderRef = useRef<FileUploaderRef>(null);

  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.userId);

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
              {/* <FileTable
                columns={columns}
                files={files}
                removeFile={removeFile}
              /> */}
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

// useEffect(() => {
//   const existingFilesString = localStorage.getItem("mediaDetails");
//   const existingFiles = existingFilesString
//     ? JSON.parse(existingFilesString)
//     : [];
//   setFiles(existingFiles);
// }, []);

// const removeFile = (index: number) => {
//   try {
//     const updatedFiles = files.filter((_, i) => i !== index);
//     setFiles(updatedFiles);
//     localStorage.setItem("mediaDetails", JSON.stringify(updatedFiles));
//     showSuccessToast("File deleted successfully");
//   } catch (error) {
//     console.log("Error deleting file:", error);
//     showErrorToast("Error deleting file");
//   }
// };

// const columns = [
//   {
//     key: "filename",
//     label: "File Name",
//     render: (file: FileProps) => file.name,
//   },
//   {
//     key: "size",
//     label: "Size",
//     render: (file: FileProps) => getFileSize(file.size),
//   },
//   {
//     key: "type",
//     label: "Type",
//     render: (file: FileProps) => truncateText(file.type),
//   },
//   {
//     key: "date",
//     label: "Date Uploaded",
//     render: (file: FileProps) => file.date,
//   },
// ];
