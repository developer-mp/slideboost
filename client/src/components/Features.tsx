import { Col, Container, Row } from "react-bootstrap";

const Features: React.FC = () => {
  return (
    <Container className="tw-flex tw-items-center tw-justify-center tw-text-center tw-mt-16">
      <Row>
        <Col>
          <h3 className="tw-text-4xl tw-font-bold tw-mb-16">
            <span className="tw-text-custom-color-teal">
              TRANSFORM PRESENTATIONS{" "}
            </span>
            <span className="tw-text-custom-color-blue">
              WITH TAILORED SOLUTIONS
            </span>
          </h3>
          <h4 className="tw-text-lg tw-mb-2 tw-text-left tw-text-custom-color-blue tw-font-bold">
            Customization
          </h4>
          <p className="tw-text-gray-700 tw-mb-4 tw-text-justify">
            Our SaaS application revolutionizes the way users create PowerPoint
            presentations by offering unparalleled customization capabilities.
            Unlike traditional tools, our platform allows users to customize
            content from a variety of sources, including video, text, images,
            and audio.
          </p>
          <h4 className="tw-text-lg tw-mb-2 tw-text-left tw-text-custom-color-blue tw-font-bold">
            Integration
          </h4>
          <p className="tw-text-gray-700 tw-mb-4 tw-text-justify">
            By integrating with various CRM platforms such as Salesforce,
            HubSpot, and Zoho, users can seamlessly pull in data from their
            customer interactions, making it easier to create personalized
            presentations and reports based on real-time insights. This
            functionality not only enhances the relevance of the content but
            also strengthens customer relationships by tailoring presentations
            to specific needs.
          </p>
          <h4 className="tw-text-lg tw-mb-2 tw-text-left tw-text-custom-color-blue tw-font-bold">
            Localization
          </h4>
          <p className="tw-text-gray-700 tw-text-justify">
            Translate your product and marketing materials into multiple
            languages to reach international markets. Customize your offerings
            for specific industries (e.g., education, marketing) to meet their
            unique needs. This approach not only enhances user engagement but
            also drives adoption and loyalty across diverse sectors.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Features;
