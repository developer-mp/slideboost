import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import start_image from "../assets/start_image.png";
import { useNavigation } from "../utils/useNavigation";
import LoginModal from "./LoginModal";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Home: React.FC = () => {
  const { navigateToCreateAccount, navigateToWorkspace } = useNavigation();
  const [modalShow, setModalShow] = useState(false);

  const openLoginModal = () => {
    setModalShow(true);
  };

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  return (
    <div
      style={{
        background: "linear-gradient(to right, #0ECFDE, #6B5B9A, #D76D77)",
        height: "88vh",
      }}
      className="tw-flex tw-flex-col tw-items-center tw-justify-center"
    >
      <Container className="tw-flex tw-grow tw-items-center">
        <Row className="align-items-center">
          <Col xs={12} md={8} lg={6} className="text-left">
            <h3 className="tw-text-white tw-font-bold">BOOST YOUR SLIDES</h3>
            <div className="tw-text-white">
              Transform your media into impactful presentations.
              <p className="tw-text-white">
                Simply upload your media and let SlideBoost handle the rest.
              </p>
            </div>
            {!isAuthenticated ? (
              <button className="button-try" onClick={openLoginModal}>
                Try for free
              </button>
            ) : (
              <button className="custom-button" onClick={navigateToWorkspace}>
                Go to workspace
              </button>
            )}
            <LoginModal
              show={modalShow}
              handleClose={() => setModalShow(false)}
              onGoogleClick={navigateToCreateAccount}
              onEmailClick={navigateToCreateAccount}
            />
          </Col>
          <Col xs={12} md={6} className="text-right">
            <img
              src={start_image}
              alt="image"
              className="tw-w-screen tw-h-auto"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
