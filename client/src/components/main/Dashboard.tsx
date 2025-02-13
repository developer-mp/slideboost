import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { Button, Container, Form } from "react-bootstrap";
import CustomModal from "../shared/CustomModal";
import TemplatesDisplay from "../widgets/TemplatesDisplay";
import MediaFilesDisplay from "../widgets/MediaFilesDisplay";
import { DashboardProps, FileDetailProps } from "../../interfaces/interfaces";
import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/common/handleToast";
import { getFileIcon } from "../../utils/ppt/getFileIcon";
import { getFileMetadata } from "../../store/actions/storageAction";
import { generatePpt } from "../../store/actions/pptAction";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../../utils/common/handleActionMessage";

const Dashboard: React.FC<DashboardProps> = ({ setSelectedItem }) => {
  const [showMediaModal, setShowMediaModal] = useState<boolean>(false);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<
    FileDetailProps[]
  >([]);

  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<FileDetailProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [presentationTitle, setPresentationTitle] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.userId);

  const fileMetadata = useSelector(
    (state: RootState) => state.fileStorage.fileMetadata
  );

  const mediafileMetadata = fileMetadata.filter(
    (file) => file.folder === "media"
  );

  const templatesfileMetadata = fileMetadata.filter(
    (file) => file.folder === "templates"
  );

  const confirmMediaSelection = () => {
    setSelectedMediaFiles(selectedMediaFiles);
    setShowMediaModal(false);
  };

  const confirmTemplateSelection = () => {
    setSelectedTemplate(selectedTemplate);
    setShowTemplateModal(false);
  };

  const handleCreate = async () => {
    setLoading(true);

    if (!presentationTitle.trim()) {
      showErrorToast("Title is required");
      setLoading(false);
      return;
    }

    if (selectedMediaFiles.length === 0) {
      showErrorToast("Please select media files");
      setLoading(false);
      return;
    }

    if (!selectedTemplate) {
      showErrorToast("Please select a template");
      setLoading(false);
      return;
    }

    let resultAction;

    try {
      const filesArr: { file_id: string; file_type: string }[] = [];

      selectedMediaFiles.forEach((file) => {
        if (file.file_id && file.type) {
          filesArr.push({ file_id: file.file_id, file_type: file.type });
        }
      });
      const templateId = selectedTemplate.file_id;
      if (filesArr && templateId) {
        resultAction = await dispatch(
          generatePpt({
            userId: userId,
            files: filesArr,
            templateId: templateId,
            title: presentationTitle,
          })
        ).unwrap();
      }
      const successMessage = handleSuccessMessage(resultAction);
      await dispatch(getFileMetadata({ userId })).unwrap();
      showSuccessToast(successMessage);
      setSelectedItem("projects");
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while creating the presentation: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="tw-w-full tw-overflow-hidden">
      <div className="tw-mx-6 tw-my-6">
        <h2 className="tw-text-lg tw-font-bold tw-mb-4 tw-text-gray-900">
          Create Presentation
        </h2>
        <div className="tw-bg-white tw-rounded-lg tw-p-5">
          <div className="tw-mb-7">
            <Form>
              <Form.Group className="tw-mb-3">
                <Form.Label className="tw-block tw-mb-2 tw-font-bold tw-text-gray-500">
                  Title
                </Form.Label>
                <Form.Control
                  id="presentationTitle"
                  type="text"
                  placeholder="Enter title of presentation"
                  name="name"
                  value={presentationTitle}
                  onChange={(e) => setPresentationTitle(e.target.value)}
                  className="input-focus input-title tw-min-w-24"
                />
              </Form.Group>
            </Form>
          </div>
          <div className="tw-mb-7">
            <div className="tw-mb-2 tw-font-bold tw-text-gray-500">Media</div>
            <Button
              className="button button-tertiary"
              onClick={() => {
                setSelectedMediaFiles([...selectedMediaFiles]);
                setShowMediaModal(true);
              }}
            >
              Select
            </Button>
            <CustomModal
              show={showMediaModal}
              handleClose={() => setShowMediaModal(false)}
              title="Select Media Files"
              actionLabel="Select"
              onAction={confirmMediaSelection}
            >
              <MediaFilesDisplay
                mediaFiles={mediafileMetadata}
                selectedMediaFiles={selectedMediaFiles}
                onSelect={setSelectedMediaFiles}
                setMediaFiles={setSelectedMediaFiles}
              />
            </CustomModal>
            {selectedMediaFiles && selectedMediaFiles.length > 0 && (
              <div className="tw-mt-3">
                {selectedMediaFiles.map((file, index) => (
                  <div key={index} className="tw-flex tw-items-center tw-mb-2">
                    {getFileIcon(file.type)}
                    <div className="tw-font-bold tw-text-gray-500 tw-ml-2">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="tw-mb-2 tw-font-bold tw-text-gray-500">Template</div>
          <Button
            className="button button-tertiary"
            onClick={() => {
              setSelectedTemplate(selectedTemplate);
              setShowTemplateModal(true);
            }}
          >
            Select
          </Button>
          <CustomModal
            show={showTemplateModal}
            handleClose={() => setShowTemplateModal(false)}
            title="Select Template"
            actionLabel="Select"
            onAction={confirmTemplateSelection}
          >
            <TemplatesDisplay
              templates={templatesfileMetadata}
              selectedTemplate={selectedTemplate}
              onSelect={setSelectedTemplate}
            />
          </CustomModal>
          {selectedTemplate && (
            <div className="tw-flex tw-items-center tw-mt-3">
              {getFileIcon(selectedTemplate.type)}
              <div className="tw-font-bold tw-text-gray-500 tw-ml-2">
                {selectedTemplate.name}
              </div>
            </div>
          )}
          <div className="tw-mt-5">
            <Button
              className="button button-primary-auto tw-my-4"
              onClick={handleCreate}
              disabled={loading}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner-border text-light" role="status"></div>
            <span className="loading-text">Creating...</span>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Dashboard;
