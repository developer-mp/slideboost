// import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import FileTable from "../shared/FileTable";
import { FileDetailProps } from "../../interfaces/interfaces";
import { getFileSize } from "../../utils/ppt/getFileSize";
import { deleteFile, getFileMetadata } from "../../store/actions/storageAction";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../../utils/common/handleActionMessage";
import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/common/handleToast";

const Projects: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.userId);

  const { fileMetadata } = useSelector((state: RootState) => state.fileStorage);

  const projectsFileMetadata = fileMetadata.filter(
    (file) => file.folder === "projects"
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
        "Error occurred while deleting the project from the storage: ",
        error
      );
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
                // downloadFile={() => {}}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default Projects;
