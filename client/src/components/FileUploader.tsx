import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FileUploaderProps } from "../interfaces/interfaces";
import MediaFilesDisplay from "./MediaFilesDisplay";
import { FileDetail } from "../interfaces/interfaces";
import { generateUniqueId } from "../utils/common/generateUniqueId";

const FileUploader = forwardRef(
  (
    { onUpload, isTemplate }: FileUploaderProps & { isTemplate?: boolean },
    ref
  ) => {
    const [fileDetails, setFileDetails] = useState<FileDetail[]>([]);
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
      const newFileDetails: Promise<FileDetail>[] = [];

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        const fileDetailPromise = new Promise<FileDetail>((resolve) => {
          reader.onload = () => {
            resolve({
              id: generateUniqueId(),
              name: file.name,
              type: file.type,
              size: file.size,
              date: new Date().toLocaleDateString(),
              content: reader.result,
              thumbnail: isTemplate
                ? "https://cdn.pixabay.com/photo/2020/11/06/18/53/flowers-5718624_1280.png"
                : undefined,
              title: isTemplate ? "Test Title" : undefined,
              category: isTemplate ? "Test Category" : undefined,
              path: "../../upload/testimage.png",
              //path: "https://www.youtube.com/watch?v=UIDwl_kP2MU",
            });
          };
          if (file.type.startsWith("image/")) {
            reader.readAsDataURL(file);
          } else if (
            file.type.startsWith("audio/") ||
            file.type.startsWith("video/")
          ) {
            reader.readAsArrayBuffer(file);
          } else {
            reader.readAsText(file);
          }
        });
        newFileDetails.push(fileDetailPromise);
      });

      Promise.all(newFileDetails).then((details) => {
        setFileDetails((prevDetails) => [...prevDetails, ...details]);
      });
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
              className="button button-tertiary tw-mt-3"
              style={{ width: "6rem" }}
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
          <MediaFilesDisplay
            mediaFiles={fileDetails}
            showSize={true}
            showDate={true}
            setMediaFiles={setFileDetails}
          />
        )}
      </Container>
    );
  }
);

export default FileUploader;
