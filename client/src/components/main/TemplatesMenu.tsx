import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { Button, Col, Container, Dropdown, Row } from "react-bootstrap";
import CustomModal from "../shared/CustomModal";
import FileUploader from "../shared/FileUploader";
import { FileUploaderRef, FileWithMetadata } from "../../interfaces/interfaces";
import {
  showErrorToast,
  showWarningToast,
  showSuccessToast,
} from "../../utils/common/handleToast";
import { getFileMetadata, uploadFile } from "../../store/actions/storageAction";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../../utils/common/handleActionMessage";
import { replaceExtension } from "../../utils/storage/replaceExtension";
import { config } from "../../../env.config";
import { removeExtension } from "./../../utils/storage/removeExtension";
import { getTemplateCategories } from "../../store/actions/dataAction";

const TemplatesMenu: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const fileUploaderRef = useRef<FileUploaderRef>(null);

  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.userId);

  const { templateCategories, isCategoriesFetched } = useSelector(
    (state: RootState) => state.dataStorage
  );

  const handleTemplateCategories = async () => {
    try {
      await dispatch(getTemplateCategories()).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while fetching the template categories: ",
        error
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

  const fileMetadata = useSelector(
    (state: RootState) => state.fileStorage.fileMetadata
  );
  const templatesfileMetadata = fileMetadata.filter(
    (file) => file.folder === "templates"
  );

  const handleUpload = async (files: FileWithMetadata[]) => {
    try {
      for (const { file, category } of files) {
        const resultAction = await dispatch(
          uploadFile({ file: [{ file, category }], userId })
        ).unwrap();
        const successMessage = handleSuccessMessage(resultAction);
        showSuccessToast(successMessage);
      }
      await dispatch(getFileMetadata({ userId })).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while uploading the file to the storage: ",
        error
      );
    }
  };

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
            {templatesfileMetadata
              .filter((template) =>
                selectedCategory === "All Categories"
                  ? true
                  : template.template_category === selectedCategory
              )
              .map((template) => (
                <Col xs={12} md={4} key={template.file_id} className="tw-mb-6">
                  <img
                    src={
                      template.file_name
                        ? `${config.DNS_ENDPOINT}/${replaceExtension(
                            template.file_name
                          )}`
                        : ""
                    }
                    alt={template.name}
                    className="img-hover tw-rounded-lg tw-h-48 tw-object-cover"
                  />
                  <div className="tw-text-black tw-font-bold tw-mt-1">
                    {removeExtension(template.name)}
                  </div>
                  <div className="tw-text-gray-500 tw-mt-0">
                    {template.template_category}
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
            (file) => file.category === null
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
        />
      </CustomModal>
    </Container>
  );
};

export default TemplatesMenu;

// useEffect(() => {
//   if (userId) {
//     dispatch(getFileMetadata({ userId }))
//       .unwrap()
//       .then(() => {
//         handleFileUrl(templatesfileMetadata);
//       })
//       .catch((error) => {
//         const errorMessage = handleErrorMessage(error);
//         showErrorToast(errorMessage);
//         console.error(
//           "Error occurred while retrieving templates metadata: ",
//           error
//         );
//       });
//   }
// }, [dispatch, userId]);

// await dispatch(getFileUrl({ fileName: file_name })).unwrap();
