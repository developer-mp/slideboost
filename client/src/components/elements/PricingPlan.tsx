import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { PricingPlanProps } from "../../interfaces/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { config } from "../../../env.config";
import CreditsModal from "../widgets/CreditsModal";
import useCredits from "../../utils/payment/useCredits";
import { useCreateCheckoutMutation } from "../../store/api/appApi";

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

  const [createCheckout] = useCreateCheckoutMutation();

  const onCheckout = async (amount: number, userId: string) => {
    return await createCheckout({ amount, userId }).unwrap();
  };

  const handleConfirm = () => {
    handleConfirmPurchase(onCheckout);
  };

  return (
    <Container>
      <Row>
        <Col className="tw-justify-items-center">
          <Card className="tw-w-80 glass-panel tw-border-0 card-hover tw-cursor-pointer tw-overflow-hidden">
            <Card.Body>
              <div
                className="tw-text-white tw-p-2 tw-rounded-xl tw-mb-3"
                style={{ backgroundColor: titleColor }}
              >
                <Card.Title className="tw-font-bold tw-mb-0">
                  {title}
                </Card.Title>
              </div>
              <Card.Title className="tw-text-2xl tw-font-extrabold tw-text-[#0f2338] tw-mb-2">
                {price}
              </Card.Title>
              <Card.Text className="tw-text-[#35506a]">{description}</Card.Text>
              <ul className="tw-list-disc tw-text-sm tw-text-[#35506a] tw-text-left tw-min-h-32">
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
