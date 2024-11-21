import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import CustomModal from "../shared/CustomModal";
import TemplatesDisplay from "../widgets/TemplatesDisplay";
import MediaFilesDisplay from "../widgets/MediaFilesDisplay";
import { FileDetailProps, TemplateProps } from "../../interfaces/interfaces";
import transcriptService from "../../services/transcript/transcriptService";
import aiService from "../../services/ai/aiService";
import pptService from "../../services/ppt/pptService";
import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/common/handleToast";

interface DashboardProps {
  setSelectedItem: (
    item: "dashboard" | "media" | "projects" | "templates"
  ) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setSelectedItem }) => {
  const [showMediaModal, setShowMediaModal] = useState<boolean>(false);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<
    FileDetailProps[]
  >([]);
  const [tempSelectedMediaFiles, setTempSelectedMediaFiles] = useState<
    FileDetailProps[]
  >([]);

  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateProps | null>(null);
  const [tempSelectedTemplate, setTempSelectedTemplate] =
    useState<TemplateProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [presentationTitle, setPresentationTitle] = useState<string>("");

  const mediaFiles: FileDetailProps[] = JSON.parse(
    localStorage.getItem("mediaDetails") || "[]"
  );
  const templates: TemplateProps[] = JSON.parse(
    localStorage.getItem("templateDetails") || "[]"
  );

  const confirmMediaSelection = () => {
    setSelectedMediaFiles(tempSelectedMediaFiles);
    setShowMediaModal(false);
  };

  const confirmTemplateSelection = () => {
    setSelectedTemplate(tempSelectedTemplate);
    setShowTemplateModal(false);
  };

  const processMediaFile = async (file: FileDetailProps) => {
    const filePath = file.path;

    try {
      let transcript = [];
      const isYouTubeLink =
        filePath.includes("youtube.com") || filePath.includes("youtu.be");

      if (isYouTubeLink) {
        transcript = await transcriptService.fetchTranscriptFromYoutube(
          filePath
        );
      } else if (file.type.startsWith("text/")) {
        transcript = await transcriptService.fetchTranscriptFromText(filePath);
        // } else if (
        //   file.type ===
        //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        // ) {
        //   transcript = await readWordFile(file);
        // } else if (file.type === "application/pdf") {
        //   transcript = await readPdfFile(file);
      } else if (file.type.startsWith("image/")) {
        transcript = await transcriptService.fetchTranscriptFromImage(filePath);
      } else if (file.type.startsWith("audio/")) {
        transcript = await transcriptService.fetchTranscriptFromAudio(filePath);
      } else if (file.type.startsWith("video/")) {
        transcript = await transcriptService.fetchTranscriptFromVideo(filePath);
      }

      return transcript;
    } catch (error) {
      console.error(
        `Error retrieving transcript from file ${file.name}:`,
        error
      );
      return "";
    }
  };

  const handleCreateClick = async () => {
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

    try {
      let allExtractedText = "";
      for (const file of selectedMediaFiles) {
        const transcript = await processMediaFile(file);
        allExtractedText += `${transcript.text}`;
      }

      const transcript = await aiService.processTranscript(allExtractedText);
      const filePath = "../../upload/beehive.pptx";
      const ppt = await pptService.processPpt(filePath, transcript.text);

      localStorage.setItem("ppt", JSON.stringify(ppt));
      setSelectedItem("projects");
      showSuccessToast("Presentation created successfully");
    } catch (error) {
      console.error("Error creating presentation:", error);
      showErrorToast("Error creating presentation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="tw-w-full">
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
                  className="input-focus input-title"
                />
              </Form.Group>
            </Form>
          </div>
          <div className="tw-mb-7">
            <div className="tw-mb-2 tw-font-bold tw-text-gray-500">Media</div>
            <Button
              className="button button-tertiary"
              onClick={() => {
                setTempSelectedMediaFiles([...selectedMediaFiles]);
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
                mediaFiles={mediaFiles}
                showSize={false}
                showDate={false}
                showCheckbox={true}
                selectedMediaFiles={tempSelectedMediaFiles}
                onSelect={setTempSelectedMediaFiles}
                showRemoveButton={false}
              />
            </CustomModal>
            <MediaFilesDisplay
              mediaFiles={selectedMediaFiles}
              showSize={false}
              showDate={false}
              showCheckbox={false}
              setMediaFiles={setSelectedMediaFiles}
              removeButtonPosition="margin-left"
            />
          </div>
          <div className="tw-mb-2 tw-font-bold tw-text-gray-500">Template</div>
          <Button
            className="button button-tertiary"
            onClick={() => {
              setTempSelectedTemplate(selectedTemplate);
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
              templates={templates}
              selectedTemplate={tempSelectedTemplate}
              onSelect={setTempSelectedTemplate}
            />
          </CustomModal>
          {selectedTemplate && (
            <div className="tw-mt-3">
              <TemplatesDisplay
                templates={[selectedTemplate]}
                showTemplateDetails={false}
              />
            </div>
          )}
          <div className="tw-mt-5">
            <Button
              className="button button-primary-auto tw-my-4"
              onClick={handleCreateClick}
              disabled={loading}
            >
              Create
            </Button>
            {loading ? "Creating..." : ""}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
