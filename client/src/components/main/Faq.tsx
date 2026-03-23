import { Accordion, Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { handleErrorMessage } from "../../utils/common/handleMessage";
import { showErrorToast } from "../../utils/common/handleToast";
import { useCallback, useEffect } from "react";
import { useLazyGetFaqQuery } from "../../store/api/appApi";

const Faq: React.FC = () => {
  const [getFaq] = useLazyGetFaqQuery();

  const { faq } = useSelector((state: RootState) => state.dataStorage);

  const handleFaq = useCallback(async () => {
    try {
      await getFaq(undefined, true).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while fetching the FAQ: ", error);
    }
  }, [getFaq]);

  useEffect(() => {
    handleFaq();
  }, [handleFaq]);

  return (
    <Container
      className="tw-flex tw-items-center tw-justify-center tw-mt-16 lg:tw-mt-0"
      style={{ minHeight: "calc(100vh - var(--navbar-height))" }}
    >
      <Row className="justify-content-center section-shell tw-w-full">
        <Col xs={12} md={12} lg={12}>
          <h3 className="section-title tw-text-3xl md:tw-text-4xl tw-text-center tw-mb-8">
            Frequently Asked Questions
          </h3>
          <Accordion className="section-copy tw-mx-auto tw-mb-4 tw-max-w-3xl tw-text-justify">
            {faq?.map((item, index) => (
              <Card key={index} className="tw-mb-3 glass-panel tw-border-0">
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
