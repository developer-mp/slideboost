import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import home_img from "../assets/home_img.png";
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
        height: "80vh",
      }}
      className="tw-flex tw-flex-col tw-items-center tw-justify-center"
    >
      <Container className="tw-flex tw-grow tw-items-center">
        <Row className="align-items-center">
          <Col xs={12} md={8} lg={6}>
            <h3 className="tw-text-custom-color-blue tw-font-bold tw-text-4xl tw-mb-8">
              BOOST YOUR SLIDES
            </h3>
            <div className="tw-text-gray-700 tw-text-xl tw-mb-4 tw-w-11/12">
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
              <button className="button-try tw-mb-4" onClick={openLoginModal}>
                Try for free
              </button>
            ) : (
              <button
                className="custom-button tw-mb-4"
                onClick={navigateToWorkspace}
              >
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
          <Col xs={12} md={6}>
            <img
              src={home_img}
              alt="image"
              className="tw-w-screen tw-h-auto tw-rounded-lg"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
