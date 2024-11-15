import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { PricingPlanProps } from "../interfaces/interfaces";

const PricingPlan: React.FC<PricingPlanProps> = ({
  title,
  price,
  description,
  features,
  titleColor,
}) => {
  return (
    <Container>
      <Row>
        <Col>
          <Card className="tw-w-72 tw-shadow-md card-hover">
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
              <Button className="button button-main">Subscribe</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PricingPlan;
