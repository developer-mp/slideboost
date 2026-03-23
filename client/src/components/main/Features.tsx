import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigation } from "../../utils/user/useNavigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import LoginModal from "../widgets/LoginModal";
import GoogleLoginModal from "../widgets/GoogleLoginModal";
import TemplateCarousel from "../shared/TemplateCarousel";
import features_img from "../../assets/main/features_img.png";
import useFetchFileData from "../../utils/storage/useFetchFileData";

const Features: React.FC = () => {
  const { navigateToCreateAccount, navigateToWorkspace } = useNavigation();
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalGoogleShow, setModalGoogleShow] = useState<boolean>(false);

  const openLoginModal = () => {
    setModalShow(true);
  };

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );

  const navigateToGoogleLogin = () => {
    setModalGoogleShow(true);
    setModalShow(false);
  };

  const handleGoogleModalClose = () => {
    setModalGoogleShow(false);
  };

  const { fileMetadata } = useSelector((state: RootState) => state.fileStorage);

  const templatesfileMetadata = fileMetadata.filter(
    (file) => file.folder === "templates",
  );

  const fetchTemplates = useFetchFileData("system");

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return (
    <Container
      className="tw-flex tw-items-center tw-justify-center tw-mt-16 lg:tw-mt-0"
      style={{ minHeight: "calc(100vh - var(--navbar-height))" }}
    >
      <Row className="w-100 section-shell tw-gap-y-6 lg:tw-gap-y-0">
        <Col className="tw-text-center">
          <h3 className="section-title tw-text-3xl md:tw-text-4xl tw-mb-4 lg:tw-mb-8 tw-mt-2">
            Customizable Templates
          </h3>
          <div className="section-copy tw-text-lg md:tw-text-xl tw-text-pretty tw-mb-8 tw-max-w-4xl tw-mx-auto">
            Personalize templates to match your brand, style, and content needs.
            Whether you're creating professional presentations or engaging
            visuals, our templates provide the flexibility to bring your vision
            to life.
          </div>
        </Col>
        <TemplateCarousel templates={templatesfileMetadata} />
        <Col xs={12} md={12} lg={6} className="tw-text-center lg:tw-text-left">
          <h3 className="section-title tw-text-3xl md:tw-text-4xl tw-mt-8 lg:tw-mt-24 tw-mb-4 lg:tw-mb-8">
            Tailored Solutions
          </h3>
          <div className="section-copy tw-text-lg md:tw-text-xl tw-mb-4 lg:tw-w-11/12">
            <p>
              Unlike traditional tools, our platform lets you customize content
              from video, text, images, and audio.
            </p>
            <p>
              Pull data from CRM platforms and content systems for seamless
              integration of customer insights.
            </p>
            <p>
              Support live events, meetings, and webinars to create real-time,
              impactful presentations. Translate, tailor for specific
              industries, and instantly share via email, chat, or social media
              to drive engagement and build loyalty.
            </p>
          </div>
          {!isAuthenticated ? (
            <button
              className="button button-tertiary-pad tw-mb-4"
              onClick={openLoginModal}
            >
              Begin Now
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
            alt="SlideBoost template customization preview"
            className="tw-w-screen tw-h-auto tw-rounded-3xl tw-shadow-xl tw-mt-4 lg:tw-mt-20 lg:tw-mb-0"
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
