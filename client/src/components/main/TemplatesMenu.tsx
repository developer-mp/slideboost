import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Button, Col, Container, Dropdown, Row } from "react-bootstrap";
import CustomModal from "../shared/CustomModal";
import FileUploader from "../shared/FileUploader";
import { FileUploaderRef, FileWithMetadata } from "../../interfaces/interfaces";
import {
  showErrorToast,
  showWarningToast,
  showSuccessToast,
} from "../../utils/common/handleToast";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../../utils/common/handleMessage";
import { replaceExtension } from "../../utils/storage/replaceExtension";
import { config } from "../../../env.config";
import { removeExtension } from "./../../utils/storage/removeExtension";
import { downloadFileBlob } from "../../utils/storage/downloadFileBlob";
import { FiDownload, FiTrash2 } from "react-icons/fi";
import { SupportedFileType } from "../../interfaces/types";
import useFetchFileData from "../../utils/storage/useFetchFileData";
import {
  useDeleteFileMutation,
  useLazyDownloadFileQuery,
  useLazyGetFileMetadataQuery,
  useLazyGetTemplateCategoriesQuery,
  useUploadFileMutation,
} from "../../store/api/appApi";

const TemplatesMenu: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const fileUploaderRef = useRef<FileUploaderRef>(null);

  const [getTemplateCategories] = useLazyGetTemplateCategoriesQuery();
  const [uploadFile] = useUploadFileMutation();
  const [getFileMetadata] = useLazyGetFileMetadataQuery();
  const [deleteFile] = useDeleteFileMutation();
  const [downloadFile] = useLazyDownloadFileQuery();
  const userId = useSelector((state: RootState) => state.user.userId);

  const { templateCategories, isCategoriesFetched } = useSelector(
    (state: RootState) => state.dataStorage,
  );

  const handleTemplateCategories = async () => {
    try {
      await getTemplateCategories(undefined, true).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while fetching the template categories: ",
        error,
      );
    }
  };

  useEffect(() => {
    if (!isCategoriesFetched) {
      handleTemplateCategories();
    }
  });

  const options = [
    { id: "all", label: "All Categories" },
    ...templateCategories.map((category) => ({
      id: category.id,
      label: category.category_name,
    })),
  ];

  const { fileMetadata } = useSelector((state: RootState) => state.fileStorage);

  const templatesfileMetadata = fileMetadata.filter(
    (file) => file.folder === "templates",
  );

  const { supportedFiles } = useSelector(
    (state: RootState) => state.dataStorage,
  );

  const supportedTemplatesExtensions = supportedFiles
    .filter((file) => file.category === "templates")
    .map((file) => file.extension);

  const supportedTemplatesFileTypes: SupportedFileType = supportedFiles
    .filter((file) => file.category === "templates")
    .reduce((acc: SupportedFileType, file) => {
      if (!acc[file.type]) {
        acc[file.type] = [];
      }
      acc[file.type].push(file.extension);
      return acc;
    }, {});

  const fetchData = useFetchFileData(userId);

  useEffect(() => {
    fetchData();
  }, [userId, fetchData]);

  const handleUpload = async (files: FileWithMetadata[]) => {
    try {
      for (const { file, category } of files) {
        const resultAction = await uploadFile({
          file: [{ file, category }],
          userId,
        }).unwrap();
        const successMessage = handleSuccessMessage(resultAction);
        showSuccessToast(successMessage);
      }
      await getFileMetadata({ userId }, true).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while uploading the file to the storage: ",
        error,
      );
    }
  };

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
        "Error occurred while deleting the template from the storage: ",
        error,
      );
    }
  };

  const downloadTemplate = async (fileId: string, fileName: string) => {
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
      console.error("Error occurred while downloading the template: ", error);
    }
  };

  return (
    <Container className="tw-w-full tw-overflow-hidden">
      <div className="tw-mx-6 tw-my-6">
        <h2 className="tw-text-lg tw-font-bold tw-text-gray-900">
          Templates Library
        </h2>
        <Button
          className="button button-primary-auto tw-my-4"
          onClick={() => setShowModal(true)}
        >
          Add Template
        </Button>
        <Dropdown className="tw-mb-4 tw-w-40">
          <Dropdown.Toggle
            id="dropdown-basic"
            className="tw-w-full dropdown-toggle-menu"
          >
            {selectedCategory}
          </Dropdown.Toggle>
          <Dropdown.Menu className="tw-w-full dropdown-menu">
            {options.map(({ id, label }) => (
              <Dropdown.Item
                key={id}
                onClick={() => setSelectedCategory(label)}
              >
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <div className="tw-bg-white tw-rounded-lg tw-p-5">
          <Row>
            {templatesfileMetadata
              .filter((template) =>
                selectedCategory === "All Categories"
                  ? true
                  : template.template_category === selectedCategory,
              )
              .map((template) => (
                <Col xs={12} md={4} key={template.file_id} className="tw-mb-6">
                  <div className="tw-flex tw-flex-col">
                    <img
                      src={
                        template.file_path
                          ? `${config.DNS_ENDPOINT}/${replaceExtension(
                              template.file_path,
                            )}`
                          : ""
                      }
                      alt={template.name}
                      className="img-hover tw-rounded-lg tw-h-48 tw-object-cover"
                    />
                    <div className="tw-flex tw-justify-between tw-items-center">
                      <div>
                        <div className="tw-text-black tw-font-bold tw-mt-1">
                          {removeExtension(template.name)}
                        </div>
                        <div className="tw-text-gray-500 tw-mt-0">
                          {template.template_category}
                        </div>
                      </div>
                      <div className="tw-flex tw-space-x-4">
                        <button
                          onClick={() =>
                            downloadTemplate(
                              template.file_id!,
                              template.file_path!,
                            )
                          }
                          className="tw-text-[#4CAF50] hover:tw-text-[#388E3C] tw-text-xl"
                        >
                          <FiDownload />
                        </button>
                        {template.source !== "system" && (
                          <button
                            onClick={() =>
                              removeFile(template.file_id!, template.file_path!)
                            }
                            className="tw-text-[#FD4958] hover:tw-text-[#DB142B] tw-text-xl"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
          </Row>
        </div>
      </div>
      <CustomModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        title="Upload Template"
        actionLabel="Upload"
        onAction={() => {
          const filesToUpload = fileUploaderRef.current?.getFileDetails();
          if (!filesToUpload || filesToUpload.length === 0) {
            showWarningToast("Please select files to upload");
            return;
          }
          const hasNullCategory = filesToUpload.some(
            (file) => file.category === null,
          );

          if (hasNullCategory) {
            showWarningToast("Please select a category");
            return;
          }
          handleUpload(filesToUpload);
          setShowModal(false);
        }}
      >
        <FileUploader
          ref={fileUploaderRef}
          onUpload={handleUpload}
          showCategory={true}
          supportedExtensions={supportedTemplatesExtensions}
        />
        <div className="tw-mt-2 tw-text-sm tw-text-gray-500 tw-text-left tw-ml-3">
          <div className="tw-mb-1">Supported file types:</div>
          {Object.keys(supportedTemplatesFileTypes).map((type) => (
            <div key={type}>
              <strong>{type}:</strong>{" "}
              {supportedTemplatesFileTypes[
                type as keyof SupportedFileType
              ].join(", ")}
            </div>
          ))}
        </div>
      </CustomModal>
    </Container>
  );
};

export default TemplatesMenu;
