import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigation } from "../../utils/user/useNavigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import LoginModal from "../widgets/LoginModal";
import GoogleLoginModal from "../widgets/GoogleLoginModal";
import about_img from "../../assets/main/about_img.png";

const About: React.FC = () => {
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
      className="tw-flex tw-items-center tw-justify-center tw-mt-16 lg:tw-mt-0"
      style={{ minHeight: "calc(100vh - var(--navbar-height))" }}
    >
      <Row className="tw-w-full section-shell tw-items-center tw-gap-y-6 lg:tw-gap-y-0">
        <Col xs={12} md={12} lg={6} className="order-last lg:order-first">
          <img
            src={about_img}
            alt="image"
            className="tw-w-screen tw-h-auto tw-rounded-3xl tw-mt-4 lg:tw-mb-0 tw-shadow-xl"
          />
        </Col>
        <Col xs={12} md={12} lg={6} className="tw-text-center lg:tw-text-left">
          <h3 className="section-title lg:tw-ml-12 tw-text-3xl md:tw-text-4xl tw-mb-4 lg:tw-mb-8">
            SLIDE INTO SUCCESS
          </h3>
          <div className="section-copy tw-text-lg md:tw-text-xl lg:tw-ml-12 tw-mb-4 lg:tw-w-11/12">
            <p>
              We empower creators, educators, and businesses to transform their
              media into engaging presentations that leave a lasting impression.
            </p>
            <p>
              Effortlessly convert, edit, and manage media using customizable
              templates and advanced features to create impactful presentations.
            </p>
          </div>
          {!isAuthenticated ? (
            <button
              className="button button-tertiary-pad tw-mb-4 lg:tw-ml-12"
              onClick={openLoginModal}
            >
              Launch now
            </button>
          ) : (
            <button
              className="button button-tertiary-pad tw-mb-4 tw-ml-12"
              onClick={navigateToWorkspace}
            >
              Start designing
            </button>
          )}
          <LoginModal
            show={modalShow}
            handleClose={() => setModalShow(false)}
            onGoogleClick={navigateToGoogleLogin}
            onEmailClick={navigateToCreateAccount}
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

export default About;
