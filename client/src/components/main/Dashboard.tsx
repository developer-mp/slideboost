import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { Button, Container, Form } from "react-bootstrap";
import CustomModal from "../shared/CustomModal";
import TemplatesDisplay from "../widgets/TemplatesDisplay";
import MediaFilesDisplay from "../widgets/MediaFilesDisplay";
import {
  DashboardProps,
  FileDetailProps,
  SurveyDataProps,
} from "../../interfaces/interfaces";
import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/common/handleToast";
import { getFileIcon } from "../../utils/ppt/getFileIcon";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../../utils/common/handleActionMessage";
import CreditsModal from "../widgets/CreditsModal";
import { config } from "../../../env.config";
import useCredits from "../../utils/payment/useCredits";
import { setSurveySent } from "../../store/slices/userSlice";
import SurveyModal from "../widgets/SurveyModal";
import {
  useCreateCheckoutMutation,
  useLazyCalculateTokensQuery,
  useLazyGeneratePptQuery,
  useLazyGetCreditBalanceQuery,
  useLazyGetFileMetadataQuery,
  useSendSurveyMutation,
} from "../../store/api/appApi";

const Dashboard: React.FC<DashboardProps> = ({ setSelectedItem }) => {
  const { userId, surveySent } = useSelector((state: RootState) => state.user);
  let initialCredits = 10;
  const pricePerCredit = Number(config.PRICE_PER_CREDIT);

  const {
    credits,
    setCredits,
    amount,
    showCreditsModal,
    handlePurchase,
    handleConfirmPurchase,
    closeCreditsModal,
  } = useCredits(initialCredits, pricePerCredit, userId);

  const [showMediaModal, setShowMediaModal] = useState<boolean>(false);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<
    FileDetailProps[]
  >([]);

  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<FileDetailProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [presentationTitle, setPresentationTitle] = useState<string>("");

  const [creditCost, setCreditCost] = useState<number>(0);
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [showSurveyModal, setShowSurveyModal] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const [calculateTokens] = useLazyCalculateTokensQuery();
  const [generatePpt] = useLazyGeneratePptQuery();
  const [getFileMetadata] = useLazyGetFileMetadataQuery();
  const [getCreditBalance] = useLazyGetCreditBalanceQuery();
  const [createCheckout] = useCreateCheckoutMutation();
  const [sendSurvey] = useSendSurveyMutation();

  const creditBalance = useSelector(
    (state: RootState) => state.user.creditBalance,
  );

  const fileMetadata = useSelector(
    (state: RootState) => state.fileStorage.fileMetadata,
  );

  const mediafileMetadata = fileMetadata.filter(
    (file) => file.folder === "media",
  );

  const templatesfileMetadata = fileMetadata.filter(
    (file) => file.folder === "templates",
  );

  const confirmMediaSelection = () => {
    setSelectedMediaFiles(selectedMediaFiles);
    setShowMediaModal(false);
  };

  const confirmTemplateSelection = () => {
    setSelectedTemplate(selectedTemplate);
    setShowTemplateModal(false);
  };

  const buildFilesArr = (): { file_id: string; file_type: string }[] => {
    return selectedMediaFiles
      .map((file) => {
        if (file.file_id && file.type) {
          return { file_id: file.file_id, file_type: file.type };
        }
        return null;
      })
      .filter(
        (file): file is { file_id: string; file_type: string } => file !== null,
      );
  };

  const handleCreate = async () => {
    setIsLoading(true);

    if (!presentationTitle.trim()) {
      showErrorToast("Title is required");
      setIsLoading(false);
      return;
    }

    if (selectedMediaFiles.length === 0) {
      showErrorToast("Please select media files");
      setIsLoading(false);
      return;
    }

    if (!selectedTemplate) {
      showErrorToast("Please select a template");
      setIsLoading(false);
      return;
    }

    let resultAction;

    try {
      const filesArr = buildFilesArr();

      if (filesArr) {
        resultAction = await calculateTokens(
          {
            userId: userId,
            files: filesArr,
          },
          true,
        ).unwrap();
      }
      const tokenCount = resultAction?.tokenCount ?? 0;
      const tokenLimit = resultAction?.tokenLimit ?? 0;
      const tokenPerCredit = resultAction?.tokenPerCredit ?? 0;
      const calculatedCreditsCost = (tokenCount / tokenPerCredit).toFixed(2);
      setCreditCost(Number(calculatedCreditsCost));
      if (tokenCount > tokenLimit) {
        const tokenLimitMessage = `Your presentation exceedes token limit of ${tokenLimit}`;
        showErrorToast(tokenLimitMessage);
      }
      initialCredits = Math.max(10, creditCost - creditBalance);
      setShowTokenModal(true);
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while calculating the tokens: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = async () => {
    setShowTokenModal(false);
    setIsLoading(true);
    try {
      const filesArr = buildFilesArr();

      let resultAction;

      const templateId = selectedTemplate?.file_id;
      if (filesArr && templateId) {
        resultAction = await generatePpt(
          {
            userId: userId,
            files: filesArr,
            templateId: templateId,
            title: presentationTitle,
            credits: creditCost,
          },
          true,
        ).unwrap();
      }
      const successMessage = handleSuccessMessage(resultAction);
      await getFileMetadata({ userId }, true).unwrap();
      await getCreditBalance({ userId }, true).unwrap();
      showSuccessToast(successMessage);
      if (!surveySent) {
        setShowSurveyModal(true);
      } else {
        setSelectedItem("projects");
      }
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while creating the presentation: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowTokenModal(false);
  };

  const onCheckout = async (amount: number, userId: string) => {
    return await createCheckout({ amount, userId }).unwrap();
  };

  const handleConfirm = () => {
    handleConfirmPurchase(onCheckout);
  };

  const handleSurvey = async (surveyData: SurveyDataProps) => {
    const surveyDataObj = {
      satisfaction: surveyData.satisfaction,
      wouldPay: surveyData.wouldPay,
      likeMost: surveyData.likeMost,
      likeLeast: surveyData.likeLeast,
      featureRequests: surveyData.featureRequests,
      easeOfUse: surveyData.easeOfUse,
      recommendation: surveyData.recommendation,
      comments: surveyData.comments,
    };
    try {
      const resultAction = await sendSurvey({
        userId,
        surveyData: surveyDataObj,
      }).unwrap();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
      dispatch(setSurveySent(true));
      setSelectedItem("projects");
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while submitting the survey: ", error);
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
              disabled={isLoading}
            >
              Create
            </Button>
            {creditBalance < creditCost ? (
              <CustomModal
                show={showTokenModal}
                handleClose={handleCancel}
                title="Credit Shortage"
                actionLabel="Purchase"
                onAction={handlePurchase}
                children={`You don't have enough credits. Please purchase ${
                  creditCost - creditBalance
                } credits to complete the presentation.`}
              />
            ) : (
              <CustomModal
                show={showTokenModal}
                handleClose={handleCancel}
                title="Credit Estimate"
                actionLabel="Proceed"
                onAction={handleProceed}
                children={`Your presentation will cost ${creditCost} credits. Do you wish to proceed?`}
              />
            )}
            <CreditsModal
              showModal={showCreditsModal}
              closeModal={closeCreditsModal}
              onConfirmPurchase={handleConfirm}
              credits={credits}
              setCredits={setCredits}
              amount={amount}
            />
            {!surveySent && (
              <SurveyModal
                showModal={showSurveyModal}
                closeModal={() => setShowSurveyModal(false)}
                onSubmit={(surveyData) => {
                  handleSurvey(surveyData);
                }}
              />
            )}
          </div>
        </div>
      </div>
      {isLoading && (
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
