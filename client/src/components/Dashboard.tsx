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

  const [extractedTextResults, setExtractedTextResults] = useState<string[]>(
    []
  );

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

  const handleCreateClick = async () => {
    // const filePath = "../../upload/testimage.jpg";
    // const filePath = "../../upload/testaudio.mp3";
    const filePath = "../../upload/testvideo.mp4";

    try {
      const transcript = await transcriptService.fetchTranscriptFromVideo(
        filePath
      );
      // const transcript = await transcriptService.fetchTranscriptFromImage(
      //   filePath
      // );

      setExtractedTextResults(transcript.text);
    } catch (error) {
      console.error("Error retrieving transcript from file:", error);
    }
  };

  return (
    <Container className="tw-w-full">
      <div className="tw-mx-6 tw-my-6">
        <h2 className="tw-text-lg tw-font-bold tw-mb-4">Create Presentation</h2>
        <div className="tw-bg-white tw-rounded-lg tw-p-5">
          {/* Title input */}
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
          {/* Media selection */}
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
          {/* Template selection */}
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
          <Button className="new-button tw-my-4" onClick={handleCreateClick}>
            Create
          </Button>
          {/* Display extracted text results */}
          {extractedTextResults.length > 0 && (
            <div className="tw-mt-5">
              <h4 className="tw-font-bold tw-text-lg">Extracted Text</h4>
              {extractedTextResults}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
