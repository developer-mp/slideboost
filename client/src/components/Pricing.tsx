import { Col, Container, Row } from "react-bootstrap";
import PricingPlan from "./PricingPlan";

const Pricing: React.FC = () => {
  return (
    <Container className="tw-text-center tw-mt-6">
      <div className="tw-bg-[#FDF3F5] tw-rounded-lg tw-shadow-lg tw-p-10 tw-max-w-full tw-mx-auto">
        <Row>
          <Col>
            <h3 className="tw-text-4xl tw-font-bold tw-mb-16">
              <span className="tw-text-custom-color-teal">
                CHOOSE THE PLAN THAT ALIGNS{" "}
              </span>
              <span className="tw-text-custom-color-blue">
                BEST WITH YOUR NEEDS
              </span>
            </h3>
            <p className="tw-text-gray-700 tw-mb-8 tw-text-justify">
              Experience the power of content transformation with our Plans.
              Whether you're a content creator, educator, or business
              professional, our Plans offer a taste of what our platform can do.
              Convert, edit, and manage your media with ease, ensuring seamless
              control, enhanced creativity, and professional quality
              presentations over your content.
            </p>
          </Col>
        </Row>
        <Row className="tw-justify-center">
          <Col
            xs={12}
            sm={6}
            md={6}
            lg={3}
            className="tw-mb-4 tw-flex tw-justify-center"
          >
            <PricingPlan
              title="Free"
              titleColor="#5670A1"
              price="$0 /mo"
              description="Good to get the feeling of the application"
              features={[
                "1 presentation creation per day",
                "Only text and video supported",
                "Watermark included",
              ]}
            />
          </Col>
          <Col
            xs={12}
            sm={6}
            md={6}
            lg={3}
            className="tw-mb-4 tw-flex tw-justify-center"
          >
            <PricingPlan
              title="Creator"
              titleColor="#90618f"
              price="$4.99 /mo"
              description="Perfect for growing businesses and educators"
              features={[
                "Unlimited presentations creation per day",
                "All media are supported",
                "No watermark",
              ]}
            />
          </Col>
          <Col
            xs={12}
            sm={6}
            md={6}
            lg={3}
            className="tw-mb-20 tw-flex tw-justify-center"
          >
            <PricingPlan
              title="Pro"
              titleColor="#cc6b7c"
              price="$9.99 /mo"
              description="For high-demand users and content creators"
              features={[
                "Unlimited presentations creation",
                "All media are supported",
                "Advanced options (translations, sharing, etc.)",
                "No watermark",
              ]}
            />
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Pricing;
