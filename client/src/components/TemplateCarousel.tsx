import { Carousel, Col, Container, Row } from "react-bootstrap";
import { PPTTemplate } from "../interfaces/interfaces";
import { TemplateCarouselProps } from "../interfaces/interfaces";
import { getItemsPerScreen } from "../utils/getItemsPerScreen";

const TemplateCarousel: React.FC<TemplateCarouselProps> = ({ templates }) => {
  const getCarouselItems = (templates: PPTTemplate[]) => {
    const items = [];
    const itemsPerScreen = getItemsPerScreen();
    for (let i = 0; i < templates.length; i += itemsPerScreen) {
      const currentTemplates = templates.slice(i, i + itemsPerScreen);
      items.push(
        <Carousel.Item key={i}>
          <Container fluid className="tw-mt-16">
            <Row className="tw-flex tw-justify-center">
              {currentTemplates.map((template: PPTTemplate) => (
                <Col key={template.id}>
                  <img
                    src={template.imgPath}
                    alt="Template"
                    className="img-fluid img-hover"
                  />
                </Col>
              ))}
            </Row>
          </Container>
        </Carousel.Item>
      );
    }
    return items;
  };
  return (
    <Carousel
      className="tw-w-full"
      controls={false}
      indicators={false}
      interval={2000}
    >
      {getCarouselItems(templates)}
    </Carousel>
  );
};
export default TemplateCarousel;
