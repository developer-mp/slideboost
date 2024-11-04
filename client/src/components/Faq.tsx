import { Accordion, Card, Col, Container, Row } from "react-bootstrap";
import { faqData } from "../data/faqData";

const Faq: React.FC = () => {
  return (
    <Container className="tw-text-center tw-mt-16">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <h3 className="tw-text-4xl tw-font-bold tw-mb-16">
            <span className="tw-text-custom-color-teal">FREQUENTLY ASKED </span>
            <span className="tw-text-custom-color-blue">QUESTIONS</span>
          </h3>
          <Accordion className="tw-text-gray-700 tw-mx-auto tw-mb-8 tw-max-w-3xl tw-text-justify">
            {faqData.map((item, index) => (
              <Card key={index} className="tw-mb-3">
                <Accordion.Item eventKey={String(index)}>
                  <Accordion.Header>{item.question}</Accordion.Header>
                  <Accordion.Body>{item.answer}</Accordion.Body>
                </Accordion.Item>
              </Card>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default Faq;
