import { Col, Container, Row } from "react-bootstrap";
import PricingPlan from "../elements/PricingPlan";

const Pricing: React.FC = () => {
  return (
    <Container
      className="tw-flex tw-items-center tw-text-center tw-mt-36"
      style={{ minHeight: "calc(100vh - var(--navbar-height))" }}
    >
      <div className="tw-max-w-full tw-mx-auto">
        <Row className="align-items-center">
          <h3 className="tw-text-custom-color-blue tw-font-bold tw-text-4xl tw-text-center tw-mb-8">
            CHOOSE THE PLAN THAT SUITS YOU BEST
          </h3>
          <div className="tw-text-gray-700 tw-text-xl tw-mb-8">
            Choose the plan that works best for you, tailored to your needs and
            goals. Whether you're looking for flexibility, advanced features, or
            cost-effective solutions, our plans offer something for everyone.
          </div>
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
