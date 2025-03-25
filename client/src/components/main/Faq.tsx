import { Accordion, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { handleErrorMessage } from "../../utils/common/handleActionMessage";
import { showErrorToast } from "../../utils/common/handleToast";
import { getFaq } from "../../store/actions/dataAction";
import { useCallback, useEffect } from "react";

const Faq: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { faq } = useSelector((state: RootState) => state.dataStorage);

  const handleFaq = useCallback(async () => {
    try {
      await dispatch(getFaq()).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while fetching the FAQ: ", error);
    }
  }, [dispatch]);

  useEffect(() => {
    handleFaq();
  }, [handleFaq]);

  return (
    <Container
      className="tw-flex tw-items-center tw-justify-center tw-mt-16 lg:tw-mt-0"
      style={{ minHeight: "calc(100vh - var(--navbar-height))" }}
    >
      <Row className="justify-content-center">
        <Col xs={12} md={12} lg={12}>
          <h3 className="tw-text-custom-color-blue tw-font-bold tw-text-3xl md:tw-text-4xl tw-text-center tw-mb-8">
            FREQUENTLY ASKED QUESTIONS
          </h3>
          <Accordion className="tw-text-gray-700 tw-mx-auto tw-mb-8 tw-max-w-3xl tw-text-justify">
            {faq?.map((item, index) => (
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
