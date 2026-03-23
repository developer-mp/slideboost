import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigation } from "../../utils/user/useNavigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import LoginModal from "../widgets/LoginModal";
import GoogleLoginModal from "../widgets/GoogleLoginModal";
import home_img from "../../assets/main/home_img.png";

const Home: React.FC = () => {
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

  return (
    <Container
      className="tw-flex tw-items-center tw-justify-center tw-mt-8 lg:tw-mt-0"
      style={{ minHeight: "calc(100vh - var(--navbar-height))" }}
    >
      <Row className="tw-w-full section-shell tw-items-center tw-gap-y-6 lg:tw-gap-y-0">
        <Col xs={12} md={12} lg={6} className="tw-text-center lg:tw-text-left">
          <h3 className="section-title tw-text-3xl md:tw-text-4xl tw-mb-4 lg:tw-mb-8">
            Turn Content Into Slides
          </h3>
          <div className="section-copy tw-text-lg md:tw-text-xl tw-mb-4 lg:tw-w-11/12">
            <p>
              Transform your media or live events into powerful, engaging
              presentations that captivate audiences and communicate your
              message effectively.
            </p>
            <p>
              Just upload your media or capture live discussions, and SlideBoost
              takes care of the rest, creating polished and professional
              presentations that make a strong impact.
            </p>
          </div>
          {!isAuthenticated ? (
            <button
              className="button button-tertiary-pad tw-mb-4"
              onClick={openLoginModal}
            >
              Start Free
            </button>
          ) : (
            <button
              className="button button-tertiary-pad tw-mb-4"
              onClick={navigateToWorkspace}
            >
              Open Workspace
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
            src={home_img}
            alt="SlideBoost workspace preview with generated presentation"
            className="tw-w-full tw-h-auto tw-rounded-3xl tw-mt-4 lg:tw-mb-0 tw-shadow-xl"
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

export default Home;
