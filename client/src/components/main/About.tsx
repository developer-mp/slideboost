import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigation } from "../../utils/login/useNavigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import LoginModal from "../widgets/LoginModal";
import about_img from "../../assets/main/about_img.png";

const About: React.FC = () => {
  const { navigateToCreateAccount, navigateToWorkspace } = useNavigation();
  const [modalShow, setModalShow] = useState<boolean>(false);

  const openLoginModal = () => {
    setModalShow(true);
  };

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  return (
    <Container
      className="d-flex align-items-center"
      style={{ minHeight: "calc(100vh - 76px)" }}
    >
      <Row className="tw-w-full">
        <Col xs={12} md={6}>
          <img
            src={about_img}
            alt="image"
            className="tw-w-screen tw-h-auto tw-rounded-lg"
          />
        </Col>
        <Col xs={12} md={8} lg={6}>
          <h3 className="tw-text-custom-color-blue tw-font-bold tw-text-4xl tw-ml-12 tw-mb-8">
            SLIDE INTO SUCCESS
          </h3>
          <div className="tw-text-gray-700 tw-text-xl tw-ml-12 tw-mb-4 tw-w-11/12">
            <p>
              We empower creators, educators, and businesses to transform their
              media into engaging presentations that captivate audiences.
            </p>
            <p>
              Effortlessly convert, edit, and manage media using customizable
              templates and advanced features to create impactful presentations.
            </p>
          </div>
          {!isAuthenticated ? (
            <button
              className="button button-tertiary-pad tw-mb-4 tw-ml-12"
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
            onGoogleClick={navigateToCreateAccount}
            onEmailClick={navigateToCreateAccount}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default About;
