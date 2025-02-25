import { Container, Row } from "react-bootstrap";
import PricingPlan from "../elements/PricingPlan";
import { config } from "../../../env.config";

const Pricing: React.FC = () => {
  return (
    <Container
      className="tw-flex tw-items-center tw-justify-center tw-mt-16 lg:tw-mt-36"
      style={{ minHeight: "calc(100vh - var(--navbar-height))" }}
    >
      <div className="tw-max-w-full tw-mx-auto tw-text-center">
        <Row className="align-items-center">
          <h3 className="tw-text-custom-color-blue tw-font-bold tw-text-3xl md:tw-text-4xl tw-text-center tw-mb-8">
            PURCHASE CREDITS TO BUILD YOUR PRESENTATION
          </h3>
          <div className="tw-text-gray-700 tw-text-xl tw-text-pretty tw-mb-8">
            Get started by purchasing credits to unlock the power of creating
            presentations effortlessly. By default, all registered users receive
            100 credits. Each credit equals 1,000 tokens, which you can use to
            create your presentations. You can top up your balance at any time
            to ensure smooth and uninterrupted creation. Before proceeding,
            you'll receive an estimate of how many credits your presentation
            requires, so you can make informed decisions.
          </div>
        </Row>
        <Row className="tw-justify-center">
          <PricingPlan
            title="Credits"
            titleColor="#5670A1"
            price={`$${config.PRICE_PER_CREDIT} /credit`}
            description=""
            features={[
              "Free 10 credits for all first-time users (approximately one A4 page of text)",
              "Unlimited presentation creations based on token usage",
              "Supports all media formats: text, images, videos, and audio",
              "No watermark included; enjoy default templates or upload your own",
            ]}
          />
        </Row>
      </div>
    </Container>
  );
};

export default Pricing;
