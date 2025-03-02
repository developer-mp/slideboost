import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { PricingPlanProps } from "../../interfaces/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { createCheckout } from "../../store/actions/paymentAction";
import { config } from "../../../env.config";
import CreditsModal from "../widgets/CreditsModal";
import useCredits from "../../utils/payment/useCredits";

const PricingPlan: React.FC<PricingPlanProps> = ({
  title,
  price,
  description,
  features,
  titleColor,
}) => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const initialCredits = 10;
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

  const dispatch = useDispatch<AppDispatch>();

  const onCheckout = async (amount: number, userId: string) => {
    return await dispatch(createCheckout({ amount, userId })).unwrap();
  };

  const handleConfirm = () => {
    handleConfirmPurchase(onCheckout);
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
                onConfirmPurchase={handleConfirm}
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
