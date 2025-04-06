import { useState } from "react";
import { Form } from "react-bootstrap";
import CustomModal from "../shared/CustomModal";
import { SurveyModalProps } from "../../interfaces/interfaces";

const SurveyModal: React.FC<SurveyModalProps> = ({
  showModal,
  closeModal,
  onSubmit,
}) => {
  const [satisfaction, setSatisfaction] = useState<string>("");
  const [wouldPay, setWouldPay] = useState<boolean | null>(null);
  const [likeMost, setLikeMost] = useState<string>("");
  const [likeLeast, setLikeLeast] = useState<string>("");
  const [featureRequests, setFeatureRequests] = useState<string>("");
  const [easeOfUse, setEaseOfUse] = useState<string>("");
  const [recommendation, setRecommendation] = useState<string>("");
  const [comments, setComments] = useState<string>("");

  return (
    <CustomModal
      show={showModal}
      handleClose={closeModal}
      title="We Value Your Feedback"
      actionLabel="Submit"
      onAction={() =>
        onSubmit({
          satisfaction,
          wouldPay,
          likeMost,
          likeLeast,
          featureRequests,
          easeOfUse,
          recommendation,
          comments,
        })
      }
    >
      <div className="tw-flex tw-items-center tw-justify-center">
        <Form>
          <Form.Group className="tw-mb-3">
            <Form.Label className="tw-block tw-mb-2 tw-font-bold tw-text-gray-500">
              How satisfied are you with the service?
            </Form.Label>
            <Form.Control
              as="select"
              value={satisfaction}
              onChange={(e) => setSatisfaction(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Very Dissatisfied">Very Dissatisfied</option>
              <option value="Dissatisfied">Dissatisfied</option>
              <option value="Neutral">Neutral</option>
              <option value="Satisfied">Satisfied</option>
              <option value="Very Satisfied">Very Satisfied</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="tw-mb-3">
            <Form.Label className="tw-block tw-mb-2 tw-font-bold tw-text-gray-500">
              Would you consider paying for this service in the future?
            </Form.Label>
            <Form.Control
              as="select"
              value={wouldPay === null ? "" : wouldPay ? "yes" : "no"}
              onChange={(e) =>
                setWouldPay(e.target.value === "yes" ? true : false)
              }
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="tw-mb-3">
            <Form.Label className="tw-block tw-mb-2 tw-font-bold tw-text-gray-500">
              What did you like the most about the service?
            </Form.Label>
            <Form.Control
              as="textarea"
              value={likeMost}
              onChange={(e) => setLikeMost(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="tw-mb-3">
            <Form.Label className="tw-block tw-mb-2 tw-font-bold tw-text-gray-500">
              What did you like the least or what could be improved?
            </Form.Label>
            <Form.Control
              as="textarea"
              value={likeLeast}
              onChange={(e) => setLikeLeast(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="tw-mb-3">
            <Form.Label className="tw-block tw-mb-2 tw-font-bold tw-text-gray-500">
              Are there any features you would like to see added in the future?
            </Form.Label>
            <Form.Control
              as="textarea"
              value={featureRequests}
              onChange={(e) => setFeatureRequests(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="tw-mb-3">
            <Form.Label className="tw-block tw-mb-2 tw-font-bold tw-text-gray-500">
              How easy was it to use the service?
            </Form.Label>
            <Form.Control
              as="select"
              value={easeOfUse}
              onChange={(e) => setEaseOfUse(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Very Difficult">Very Difficult</option>
              <option value="Difficult">Difficult</option>
              <option value="Neutral">Neutral</option>
              <option value="Easy">Easy</option>
              <option value="Very Easy">Very Easy</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="tw-mb-3">
            <Form.Label className="tw-block tw-mb-2 tw-font-bold tw-text-gray-500">
              How likely are you to recommend this service to others?
            </Form.Label>
            <Form.Control
              as="select"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Not Likely">Not Likely</option>
              <option value="Unlikely">Unlikely</option>
              <option value="Neutral">Neutral</option>
              <option value="Likely">Likely</option>
              <option value="Very Likely">Very Likely</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="tw-mb-3">
            <Form.Label className="tw-block tw-mb-2 tw-font-bold tw-text-gray-500">
              Do you have any other comments or suggestions?
            </Form.Label>
            <Form.Control
              as="textarea"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </Form.Group>
        </Form>
      </div>
    </CustomModal>
  );
};

export default SurveyModal;
