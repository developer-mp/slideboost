import { Form } from "react-bootstrap";
import CustomModal from "../shared/CustomModal";

interface CreditsModalProps {
  showModal: boolean;
  closeModal: () => void;
  onConfirmPurchase: () => void;
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  amount: number;
}

const CreditsModal: React.FC<CreditsModalProps> = ({
  showModal,
  closeModal,
  onConfirmPurchase,
  credits,
  setCredits,
  amount,
}) => {
  return (
    <CustomModal
      show={showModal}
      handleClose={closeModal}
      title="Purchase Credits"
      actionLabel="Order"
      onAction={onConfirmPurchase}
    >
      <div className="tw-flex tw-items-center tw-justify-center">
        <Form>
          <Form.Group className="tw-mb-3">
            <Form.Label className="tw-block tw-mb-2 tw-font-bold tw-text-gray-500">
              Select number of credits
            </Form.Label>
            <div className="tw-flex tw-items-center">
              <Form.Control
                type="number"
                name="credits"
                value={credits}
                onChange={(e) =>
                  setCredits(Math.max(Number(e.target.value), 0))
                }
                className="input-focus input-field tw-max-w-24"
              />
              <span className="tw-ml-3 tw-font-bold">
                $ {amount.toFixed(2)}
              </span>
            </div>
          </Form.Group>
        </Form>
      </div>
    </CustomModal>
  );
};

export default CreditsModal;
