import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { PricingPlanProps } from "../../interfaces/interfaces";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { createCheckout } from "../../store/actions/paymentAction";
import { handleErrorMessage } from "../../utils/common/handleActionMessage";
import { showErrorToast } from "../../utils/common/handleToast";

const PricingPlan: React.FC<PricingPlanProps> = ({
  title,
  price,
  description,
  features,
  titleColor,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handlePurchase = async () => {
    const credits = 100;

    try {
      const resultAction = await dispatch(
        createCheckout({
          title,
          credits,
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
  };

  return (
    <Container>
      <Row>
        <Col className="tw-justify-items-center">
          <Card className="tw-w-72 tw-shadow-md card-hover tw-cursor-pointer">
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PricingPlan;
