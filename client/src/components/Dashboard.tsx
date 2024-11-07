import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import CustomModal from "./CustomModal";
import TemplatesDisplay from "./TemplatesDisplay";
import MediaFilesDisplay from "./MediaFilesDisplay";
import { FileDetail, Template } from "../interfaces/interfaces";
import transcriptService from "../services/transcript/transcriptService";

const Dashboard: React.FC = () => {
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<FileDetail[]>(
    []
  );
  const [tempSelectedMediaFiles, setTempSelectedMediaFiles] = useState<
    FileDetail[]
  >([]);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [tempSelectedTemplate, setTempSelectedTemplate] =
    useState<Template | null>(null);

  const [extractedTextResults, setExtractedTextResults] = useState<string>("");

  const mediaFiles: FileDetail[] = JSON.parse(
    localStorage.getItem("mediaDetails") || "[]"
  );
  const templates: Template[] = JSON.parse(
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

  const processMediaFile = async (file: FileDetail) => {
    const filePath = file.path;

    try {
      let transcript = [];
      const isYouTubeLink =
        filePath.includes("youtube.com") || filePath.includes("youtu.be");

      if (isYouTubeLink) {
        transcript = await transcriptService.fetchTranscriptFromYoutube(
          filePath
        );
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
    let allExtractedText = "";

    for (const file of selectedMediaFiles) {
      const transcript = await processMediaFile(file);
      allExtractedText += `\n\n--- Transcript from ${file.name} ---\n\n${transcript.text}`;
    }

    setExtractedTextResults(allExtractedText);
  };

  return (
    <Container className="tw-w-full">
      <div className="tw-mx-6 tw-my-6">
        <h2 className="tw-text-lg tw-font-bold tw-mb-4">Create Presentation</h2>
        <div className="tw-bg-white tw-rounded-lg tw-p-5">
          <div className="tw-mb-7">
            <label className="tw-block tw-mb-2 tw-font-bold tw-text-gray-500">
              Title
            </label>
            <input
              id="presentationTitle"
              type="text"
              placeholder="Title of the presentation"
              className="tw-w-4/12 tw-p-2 tw-rounded-lg tw-border tw-border-gray-500"
            />
          </div>
          <div className="tw-mb-7">
            <div className="tw-mb-2 tw-font-bold tw-text-gray-500">Media</div>
            <Button
              className="button-select"
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
            className="button-select"
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
            <Button className="new-button tw-my-4" onClick={handleCreateClick}>
              Create
            </Button>
            {extractedTextResults}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
