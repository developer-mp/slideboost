import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigation } from "../utils/useNavigation";
import LoginModal from "./LoginModal";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import features_img from "../assets/features_img.jpg";
import { templatesData } from "../data/templatesData";
import TemplateCarousel from "../components/TemplateCarousel";

const Features: React.FC = () => {
  const { navigateToCreateAccount, navigateToWorkspace } = useNavigation();
  const [modalShow, setModalShow] = useState(false);

  const openLoginModal = () => {
    setModalShow(true);
  };

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  return (
    <Container className="tw-flex tw-grow tw-items-center">
      <Row className="align-items-center">
        <h3 className="tw-text-custom-color-blue tw-font-bold tw-text-4xl tw-text-center tw-mb-8">
          CUSTOMIZABLE TEMPLATES
        </h3>
        <div className="tw-text-gray-700 tw-text-xl tw-mb-8">
          Personalize templates to match your brand, style, and content needs.
          Whether you're creating professional presentations or engaging
          visuals, our templates provide the flexibility to bring your vision to
          life.
        </div>
        <TemplateCarousel templates={templatesData} />
        <Col xs={12} md={8} lg={6}>
          <h3 className="tw-text-custom-color-blue tw-font-bold tw-text-4xl tw-mb-8 tw-mt-40">
            TAILORED SOLUTIONS
          </h3>
          <div className="tw-text-gray-700 tw-text-xl tw-w-11/12">
            <p>
              Unlike traditional tools, our platform lets you customize content
              from video, text, images, and audio.
            </p>
            <p>
              Pull data from CRM platforms and content systems for seamless
              integration of customer insights.
            </p>
            <p>
              Translate, customize for industries, and instantly share via
              email, chat, or social media to boost engagement and loyalty.
            </p>
          </div>
          {!isAuthenticated ? (
            <button className="button-try tw-mb-4" onClick={openLoginModal}>
              Try for free
            </button>
          ) : (
            <button
              className="custom-button tw-mb-4"
              onClick={navigateToWorkspace}
            >
              Create presentation
            </button>
          )}
          <LoginModal
            show={modalShow}
            handleClose={() => setModalShow(false)}
            onGoogleClick={navigateToCreateAccount}
            onEmailClick={navigateToCreateAccount}
          />
        </Col>
        <Col xs={12} md={6}>
          <img
            src={features_img}
            alt="image"
            className="tw-w-screen tw-h-auto tw-rounded-lg tw-mt-40"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Features;
