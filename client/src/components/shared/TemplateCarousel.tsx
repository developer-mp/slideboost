import { Carousel, Col, Container, Row } from "react-bootstrap";
import {
  FileDetailProps,
  TemplateCarouselProps,
} from "../../interfaces/interfaces";
import { getItemsPerScreen } from "../../utils/common/getItemsPerScreen";
import { replaceExtension } from "../../utils/storage/replaceExtension";
import { config } from "../../../env.config";

const TemplateCarousel: React.FC<TemplateCarouselProps> = ({ templates }) => {
  const getCarouselItems = (templates: FileDetailProps[]) => {
    const items = [];
    const itemsPerScreen = getItemsPerScreen();
    for (let i = 0; i < templates.length; i += itemsPerScreen) {
      const currentTemplates = templates.slice(i, i + itemsPerScreen);
      items.push(
        <Carousel.Item key={i}>
          <Container fluid>
            <Row className="tw-flex tw-justify-center">
              {currentTemplates.map((template: FileDetailProps) => (
                <Col key={template.file_id}>
                  <img
                    src={
                      template.file_name
                        ? `${config.DNS_ENDPOINT}/${replaceExtension(
                            template.file_name
                          )}`
                        : ""
                    }
                    alt={template.name}
                    className="img-fluid img-hover tw-rounded-lg"
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
