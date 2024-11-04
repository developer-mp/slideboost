import { Col, Container, Row } from "react-bootstrap";

const About: React.FC = () => {
  return (
    <Container className="tw-flex tw-items-center tw-justify-center tw-text-center tw-mt-6">
      <div className="tw-bg-[#F0FAFA] tw-rounded-lg tw-shadow-lg tw-p-10 tw-max-w-full tw-mx-auto">
        <Row>
          <Col>
            <h3 className="tw-text-4xl tw-font-bold tw-mb-16">
              <span className="tw-text-custom-color-teal">
                BOOST YOUR MEDIA,{" "}
              </span>
              <span className="tw-text-custom-color-blue">
                SLIDE INTO SUCCESS
              </span>
            </h3>
            <h4 className="tw-text-lg tw-mb-2 tw-text-left tw-text-custom-color-blue tw-font-bold">
              Who We Are
            </h4>
            <p className="tw-text-gray-700 tw-mb-4 tw-text-justify">
              At SlideBoost, we empower creators, educators, and businesses to
              unlock the full potential of their media effortlessly. Our passion
              lies in transforming content into impactful presentations that
              captivate and engage audiences.
            </p>
            <h4 className="tw-text-lg tw-mb-2 tw-text-left tw-text-custom-color-blue tw-font-bold">
              Our Mission
            </h4>
            <p className="tw-text-gray-700 tw-mb-4 tw-text-justify">
              We simplify the presentation creation process, enabling you to
              focus on what truly matters - your message. With SlideBoost, you
              can convert, edit, and manage your media seamlessly, streamlining
              your workflow for optimal results.
            </p>
            <h4 className="tw-text-lg tw-mb-2 tw-text-left tw-text-custom-color-blue tw-font-bold">
              Key Features
            </h4>
            <p className="tw-text-gray-700 tw-text-justify">
              SlideBoost is your ultimate tool for creating engaging
              presentations from videos, texts, images, and audio. Our automated
              conversion allows you to upload your media and let our intelligent
              algorithms handle the design, ensuring a polished, professional
              outcome every time. Enjoy seamless integration of diverse content
              types, customizable templates, and advanced editing features to
              enhance your storytelling.
            </p>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default About;
