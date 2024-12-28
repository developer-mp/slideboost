import { useState, useRef } from "react";
import { Button, Col, Container, Dropdown, Row } from "react-bootstrap";
import CustomModal from "../shared/CustomModal";
import FileUploader from "../shared/FileUploader";
import { templatesData } from "../../data/templatesData";
import {
  PPTTemplateProps,
  FileUploaderRef,
  FileDetailProps,
  TemplateProps,
} from "../../interfaces/interfaces";
import { templatesCategories } from "../../data/templatesCategories";
import { handleFileUpload } from "../../utils/ppt/handleFileUpload";
import TemplatesDisplay from "../widgets/TemplatesDisplay";
import {
  showErrorToast,
  showWarningToast,
  showSuccessToast,
} from "../../utils/common/handleToast";

const TemplatesMenu: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const fileUploaderRef = useRef<FileUploaderRef>(null);

  const options = [
    { id: "all", label: "All Categories" },
    ...templatesCategories.map((category) => ({
      id: category.id,
      label: category.category,
    })),
  ];

  const handleUpload = (files: FileDetailProps[]) => {
    if (files && files.length > 0) {
      try {
        handleFileUpload(files, "templateDetails");
        showSuccessToast("File uploaded successfully");
      } catch (error) {
        console.log("Error uploading file: ", error);
        showErrorToast("Error uploading file");
      }
    }
  };

  const templates: TemplateProps[] = JSON.parse(
    localStorage.getItem("templateDetails") || "[]"
  );

  return (
    <Container className="tw-w-full tw-overflow-hidden">
      <div className="tw-mx-6 tw-my-6">
        <h2 className="tw-text-lg tw-font-bold tw-text-gray-900">
          Templates Collection
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
            {templatesData
              .filter((template) =>
                selectedCategory === "All Categories"
                  ? true
                  : template.category === selectedCategory
              )
              .map((template: PPTTemplateProps) => (
                <Col xs={12} md={4} key={template.id} className="tw-mb-6">
                  <img
                    src={template.imgPath}
                    alt="Template"
                    className="img-hover tw-rounded-lg tw-h-48 tw-object-cover"
                  />
                  <div className="tw-text-black tw-font-bold tw-mt-1">
                    {template.title}
                  </div>
                  <div className="tw-text-gray-500 tw-mt-0">
                    {template.category}
                  </div>
                </Col>
              ))}
            <TemplatesDisplay templates={templates} />
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
          if (filesToUpload) {
            handleUpload(filesToUpload);
            setShowModal(false);
          }
        }}
      >
        <FileUploader
          ref={fileUploaderRef}
          onUpload={handleUpload}
          isTemplate={true}
        />
      </CustomModal>
    </Container>
  );
};

export default TemplatesMenu;
