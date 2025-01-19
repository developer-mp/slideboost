import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { IoCloudUploadOutline } from "react-icons/io5";
import {
  FileUploaderProps,
  FileUploaderRef,
  FileWithMetadata,
} from "../../interfaces/interfaces";
import UploadFilesDisplay from "../widgets/UploadFilesDisplay";

const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(
  ({ onUpload, showCategory }, ref) => {
    const [fileDetails, setFileDetails] = useState<FileWithMetadata[]>([]);
    const [templateCategory, setTemplateCategory] = useState<string | null>(
      null
    );
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => ({
      getFileDetails: () => fileDetails,
      uploadFiles: () => {
        onUpload(fileDetails);
      },
    }));

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      handleFiles(files);
    };

    const handleBrowse = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        handleFiles(files);
      }
    };

    const handleFiles = (files: FileList) => {
      const newFilesWithMetadata: FileWithMetadata[] = Array.from(files).map(
        (file) => ({
          file,
          category: templateCategory,
        })
      );
      setFileDetails((prevDetails) => [
        ...prevDetails,
        ...newFilesWithMetadata,
      ]);
    };

    const handleCategoryChange = (category: string) => {
      setTemplateCategory(category);
      setFileDetails((prevDetails) =>
        prevDetails.map((file) => ({ ...file, category }))
      );
    };

    return (
      <Container>
        <Card className="tw-w-full">
          <Card.Body
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="tw-text-center tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-48 tw-border-2 tw-border-dashed tw-border-gray-500"
          >
            <IoCloudUploadOutline className="tw-text-6xl tw-text-gray-500" />
            <div>Drop a file here</div>
            <Button
              onClick={handleBrowse}
              className="button button-tertiary tw-mt-3 tw-w-24"
            >
              Browse
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              multiple
            />
          </Card.Body>
        </Card>
        {fileDetails.length > 0 && (
          <UploadFilesDisplay
            files={fileDetails}
            setFiles={setFileDetails}
            showCategory={showCategory}
            onCategoryChange={handleCategoryChange}
          />
        )}
      </Container>
    );
  }
);

export default FileUploader;
