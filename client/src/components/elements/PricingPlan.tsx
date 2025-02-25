import { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { PricingPlanProps } from "../../interfaces/interfaces";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { createCheckout } from "../../store/actions/paymentAction";
import { handleErrorMessage } from "../../utils/common/handleActionMessage";
import { showErrorToast } from "../../utils/common/handleToast";
import { config } from "../../../env.config";
import CreditsModal from "../widgets/CreditsModal";

const PricingPlan: React.FC<PricingPlanProps> = ({
  title,
  price,
  description,
  features,
  titleColor,
}) => {
  const [showCreditsModal, setShowCreditsModal] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(10);
  const [amount, setAmount] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();

  const handlePurchase = async () => {
    setShowCreditsModal(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      const resultAction = await dispatch(
        createCheckout({
          amount,
        })
      ).unwrap();

      const { url } = resultAction;

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while creating the checkout session: ",
        error
      );
    }
    setShowCreditsModal(false);
  };

  const updateAmount = useCallback(() => {
    const newAmount = Math.max(credits * Number(config.PRICE_PER_CREDIT), 0);
    setAmount(parseFloat(newAmount.toFixed(2)));
  }, [credits]);

  useEffect(() => {
    updateAmount();
  }, [updateAmount]);

  const closeCreditsModal = () => {
    setShowCreditsModal(false);
    setCredits(10);
  };

  return (
    <Container>
      <Row>
        <Col className="tw-justify-items-center">
          <Card className="tw-w-96 tw-shadow-md card-hover tw-cursor-pointer">
            <Card.Body>
              <div
                className="tw-text-white tw-p-2 tw-rounded-md tw-mb-2"
                style={{ backgroundColor: titleColor }}
              >
                <Card.Title>{title}</Card.Title>
              </div>
              <Card.Title>{price}</Card.Title>
              <Card.Text>{description}</Card.Text>
              <ul className="tw-list-disc tw-text-sm tw-text-gray-700 tw-text-left tw-min-h-32">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <Button
                className="button button-tertiary-auto"
                onClick={handlePurchase}
              >
                Purchase
              </Button>
              <CreditsModal
                showModal={showCreditsModal}
                closeModal={closeCreditsModal}
                onConfirmPurchase={handleConfirmPurchase}
                credits={credits}
                setCredits={setCredits}
                amount={amount}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PricingPlan;
