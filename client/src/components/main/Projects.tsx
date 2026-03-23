import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import FileTable from "../shared/FileTable";
import { FileDetailProps } from "../../interfaces/interfaces";
import { getFileSize } from "../../utils/ppt/getFileSize";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../../utils/common/handleMessage";
import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/common/handleToast";
import { downloadFileBlob } from "../../utils/storage/downloadFileBlob";
import {
  useDeleteFileMutation,
  useLazyDownloadFileQuery,
  useLazyGetFileMetadataQuery,
} from "../../store/api/appApi";

const Projects: React.FC = () => {
  const [deleteFile] = useDeleteFileMutation();
  const [downloadFile] = useLazyDownloadFileQuery();
  const [getFileMetadata] = useLazyGetFileMetadataQuery();
  const userId = useSelector((state: RootState) => state.user.userId);

  const { fileMetadata } = useSelector((state: RootState) => state.fileStorage);

  const projectsFileMetadata = fileMetadata.filter(
    (file) => file.folder === "projects",
  );

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
      key: "uploaded_at",
      label: "Created At",
      render: (file: FileDetailProps) =>
        file.uploaded_at ? new Date(file.uploaded_at).toLocaleString() : "N/A",
    },
  ];

  const removeFile = async (fileId: string, fileName: string) => {
    try {
      const resultAction = await deleteFile({ fileId, fileName }).unwrap();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
      await getFileMetadata({ userId }, true).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while deleting the project from the storage: ",
        error,
      );
    }
  };

  const downloadProject = async (fileId: string, fileName: string) => {
    try {
      const resultAction = await downloadFile({ fileId }, true).unwrap();
      const successMessage = handleSuccessMessage(resultAction);

      const { data } = resultAction;
      const fileData = data.data;
      const fileType = data.type;
      const extractedFileName = fileName.split("/").pop();
      downloadFileBlob(
        fileData,
        fileType,
        extractedFileName || "downloaded-file",
      );
      showSuccessToast(successMessage);
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while downloading the project: ", error);
    }
  };

  return (
    <Container className="tw-w-full tw-overflow-hidden">
      <div className="tw-mx-6 tw-my-6">
        <h2 className="tw-text-lg tw-font-bold tw-text-gray-900">
          Project List
        </h2>
        <div className="tw-bg-white tw-rounded-lg tw-p-5 tw-overflow-x-auto md:tw-overflow-x-visible">
          <Row>
            <Col>
              <FileTable
                columns={columns}
                files={projectsFileMetadata}
                removeFile={removeFile}
                downloadFile={downloadProject}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default Projects;
