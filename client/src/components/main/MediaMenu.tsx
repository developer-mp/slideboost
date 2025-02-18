import { useState, useRef, useEffect } from "react";
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
import {
  FileDetailProps,
  FileUploaderRef,
  FileWithMetadata,
} from "../../interfaces/interfaces";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../../utils/common/handleActionMessage";
import {
  deleteFile,
  downloadFile,
  getFileMetadata,
  uploadFile,
} from "../../store/actions/storageAction";
import FileTable from "../shared/FileTable";
import { getFileSize } from "../../utils/ppt/getFileSize";
import { truncateText } from "../../utils/common/truncateText";
import { downloadFileBlob } from "../../utils/storage/downloadFileBlob";
import { getSupportedFiles } from "../../store/actions/dataAction";
import { SupportedFileType } from "../../interfaces/types";

const MediaMenu: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const fileUploaderRef = useRef<FileUploaderRef>(null);

  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.userId);

  const { fileMetadata, isFileMetadataFetched } = useSelector(
    (state: RootState) => state.fileStorage
  );

  const mediafileMetadata = fileMetadata.filter(
    (file) => file.folder === "media"
  );

  const { supportedFiles, isSupportedFilesFetched } = useSelector(
    (state: RootState) => state.dataStorage
  );

  const supportedMediaExtensions = supportedFiles
    .filter((file) => file.category === "media")
    .map((file) => file.extension);

  const supportedMediaFileTypes: SupportedFileType = supportedFiles
    .filter((file) => file.category === "media")
    .reduce((acc: SupportedFileType, file) => {
      if (!acc[file.type]) {
        acc[file.type] = [];
      }
      acc[file.type].push(file.extension);
      return acc;
    }, {});

  const handleMediaSupportedFiles = async () => {
    try {
      await dispatch(getSupportedFiles()).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while fetching the supported files: ",
        error
      );
    }
  };

  const handleFileMetadata = async () => {
    try {
      await dispatch(getFileMetadata({ userId })).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while fetching the file metadata: ", error);
    }
  };

  useEffect(() => {
    if (!isFileMetadataFetched) {
      handleFileMetadata();
    }
    if (!isSupportedFilesFetched) {
      handleMediaSupportedFiles();
    }
  });

  const handleUpload = async (files: FileWithMetadata[]) => {
    try {
      for (const { file, category } of files) {
        const resultAction = await dispatch(
          uploadFile({ file: [{ file, category }], userId })
        ).unwrap();
        const successMessage = handleSuccessMessage(resultAction);
        showSuccessToast(successMessage);
      }
      await dispatch(getFileMetadata({ userId })).unwrap();
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
      render: (file: FileDetailProps) => truncateText(file.type, 20),
    },
    {
      key: "uploaded_at",
      label: "Uploaded At",
      render: (file: FileDetailProps) =>
        file.uploaded_at ? new Date(file.uploaded_at).toLocaleString() : "N/A",
    },
  ];

  const removeFile = async (fileId: string, fileName: string) => {
    try {
      const resultAction = await dispatch(
        deleteFile({ fileId, fileName })
      ).unwrap();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
      await dispatch(getFileMetadata({ userId })).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while deleting the media file from the storage: ",
        error
      );
    }
  };

  const downloadMediaFile = async (fileId: string, fileName: string) => {
    try {
      const resultAction = await dispatch(downloadFile({ fileId })).unwrap();
      const successMessage = handleSuccessMessage(resultAction);

      const { data } = resultAction;
      const fileData = data.data;
      const fileType = data.type;
      const extractedFileName = fileName.split("/").pop();
      downloadFileBlob(
        fileData,
        fileType,
        extractedFileName || "downloaded-file"
      );
      showSuccessToast(successMessage);
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while downloading the media file: ", error);
    }
  };

  return (
    <Container className="tw-w-full tw-overflow-hidden">
      <div className="tw-mx-6 tw-my-6">
        <h2 className="tw-text-lg tw-font-bold tw-text-gray-900">
          Media Library
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
                files={mediafileMetadata}
                removeFile={removeFile}
                downloadFile={downloadMediaFile}
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
        <FileUploader
          ref={fileUploaderRef}
          onUpload={handleUpload}
          showCategory={false}
          supportedExtensions={supportedMediaExtensions}
        />
        <div className="tw-mt-2 tw-text-sm tw-text-gray-500 tw-text-left tw-ml-3">
          <div className="tw-mb-1">Supported file types:</div>
          {Object.keys(supportedMediaFileTypes).map((type) => {
            const extensions =
              supportedMediaFileTypes[type as keyof SupportedFileType];
            let displayExtensions = extensions.join(", ");

            if (type === "Image" || type === "Video") {
              displayExtensions += " and others";
            }

            return (
              <div key={type}>
                <strong>{type}:</strong> {displayExtensions}
              </div>
            );
          })}
        </div>
      </CustomModal>
    </Container>
  );
};

export default MediaMenu;
