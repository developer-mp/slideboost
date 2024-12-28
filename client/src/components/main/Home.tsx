import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigation } from "../../utils/login/useNavigation";
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
      className="tw-flex tw-items-center tw-justify-center tw-mt-8 lg:tw-mt-0"
      style={{ minHeight: "calc(100vh - var(--navbar-height))" }}
    >
      <Row className="tw-w-full">
        <Col xs={12} md={12} lg={6} className="tw-text-center lg:tw-text-left">
          <h3 className="tw-text-custom-color-blue tw-font-bold tw-text-3xl md:tw-text-4xl tw-mb-4 lg:tw-mb-8">
            BOOST YOUR SLIDES
          </h3>
          <div className="tw-text-gray-700 tw-text-xl tw-mb-4 lg:tw-w-11/12">
            <p>
              Transform your media into powerful, engaging presentations that
              captivate audiences and communicate your message effectively.
            </p>
            <p>
              Just upload your media, and SlideBoost takes care of the rest,
              creating polished and professional presentations that make a
              strong impact.
            </p>
          </div>
          {!isAuthenticated ? (
            <button
              className="button button-tertiary-pad tw-mb-4"
              onClick={openLoginModal}
            >
              Try for free
            </button>
          ) : (
            <button
              className="button button-tertiary-pad tw-mb-4"
              onClick={navigateToWorkspace}
            >
              Go to workspace
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
            alt="image"
            className="tw-w-full tw-h-auto tw-rounded-lg tw-mt-4 lg:tw-mb-0"
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
