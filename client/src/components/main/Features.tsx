import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigation } from "../../utils/login/useNavigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import LoginModal from "../widgets/LoginModal";
import GoogleLoginModal from "../widgets/GoogleLoginModal";
import TemplateCarousel from "../shared/TemplateCarousel";
import features_img from "../../assets/main/features_img.png";
import { templatesData } from "../../data/templatesData";

const Features: React.FC = () => {
  const { navigateToCreateAccount, navigateToWorkspace } = useNavigation();
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalGoogleShow, setModalGoogleShow] = useState<boolean>(false);

  const openLoginModal = () => {
    setModalShow(true);
  };

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const navigateToGoogleLogin = () => {
    setModalGoogleShow(true);
    setModalShow(false);
  };

  const handleGoogleModalClose = () => {
    setModalGoogleShow(false);
  };

  return (
    <Container
      className="tw-flex tw-items-center tw-justify-center tw-mt-16 lg:tw-mt-0"
      style={{ minHeight: "calc(100vh - var(--navbar-height))" }}
    >
      <Row className="w-100">
        <Col className="tw-text-center">
          <h3 className="tw-text-custom-color-blue tw-font-bold tw-text-3xl md:tw-text-4xl tw-mb-4 lg:tw-mb-8 tw-mt-4">
            CUSTOMIZABLE TEMPLATES
          </h3>
          <div className="tw-text-gray-700 tw-text-xl tw-mb-8">
            Personalize templates to match your brand, style, and content needs.
            Whether you're creating professional presentations or engaging
            visuals, our templates provide the flexibility to bring your vision
            to life.
          </div>
        </Col>
        <TemplateCarousel templates={templatesData} />
        <Col xs={12} md={12} lg={6} className="tw-text-center lg:tw-text-left">
          <h3 className="tw-text-custom-color-blue tw-font-bold tw-text-3xl md:tw-text-4xl tw-mt-8 lg:tw-mt-40 tw-mb-4 lg:tw-mb-8 ">
            TAILORED SOLUTIONS
          </h3>
          <div className="tw-text-gray-700 tw-text-xl tw-mb-4 lg:tw-w-11/12">
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
            <button
              className="button button-tertiary-pad tw-mb-4"
              onClick={openLoginModal}
            >
              Start right away
            </button>
          ) : (
            <button
              className="button button-tertiary-pad tw-mb-4"
              onClick={navigateToWorkspace}
            >
              Create presentation
            </button>
          )}
          <LoginModal
            show={modalShow}
            handleClose={() => setModalShow(false)}
            onGoogleClick={navigateToGoogleLogin}
            onEmailClick={navigateToCreateAccount}
          />
        </Col>
        <Col xs={12} md={12} lg={6}>
          <img
            src={features_img}
            alt="image"
            className="tw-w-screen tw-h-auto tw-rounded-lg tw-mt-4 lg:tw-mt-40 lg:tw-mb-0"
          />
        </Col>
      </Row>
      {modalGoogleShow && (
        <GoogleLoginModal
          show={modalGoogleShow}
          handleClose={handleGoogleModalClose}
        />
      )}
    </Container>
  );
};

export default Features;
