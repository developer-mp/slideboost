import { useState } from "react";
import { Button, Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { useNavigation } from "../../utils/login/useNavigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { HashLink as Link } from "react-router-hash-link";
import { getFirstChar } from "../../utils/login/getFirstChar";
import { adjustScrollForNavbar } from "../../utils/common/adjustScrollForNavbar";
import { logoutUser } from "../../store/actions/userAction";
import LoginModal from "../widgets/LoginModal";
import GoogleLoginModal from "../widgets/GoogleLoginModal";
import logo_text from "../../assets/main/logo_text.png";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../../utils/common/handleActionMessage";
import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/common/handleToast";

const NavigationBar: React.FC = () => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalGoogleShow, setModalGoogleShow] = useState<boolean>(false);

  const openLoginModal = () => {
    setModalShow(true);
  };

  const navigateToGoogleLogin = () => {
    setModalGoogleShow(true);
    setModalShow(false);
  };

  const handleGoogleModalClose = () => {
    setModalGoogleShow(false);
  };

  const { navigateToLogin } = useNavigation();

  const dispatch = useDispatch<AppDispatch>();
  const { navigateToHome } = useNavigation();

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const userName = useSelector((state: RootState) => state.user.userName);
  const firstInitial = getFirstChar(userName);

  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logoutUser()).unwrap();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
      navigateToHome();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while logging out: ", error);
    }
  };

  return (
    <Navbar expand="lg" className="bg-light sticky-top">
      <Container className="tw-mt-4">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <img src={logo_text} alt="logo" className="tw-w-40 tw-mr-8" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              smooth
              to="/#home"
              scroll={(el: HTMLElement) => adjustScrollForNavbar(el)}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              smooth
              to="/#about"
              scroll={(el: HTMLElement) => adjustScrollForNavbar(el)}
            >
              About
            </Nav.Link>
            <Nav.Link
              as={Link}
              smooth
              to="/#features"
              scroll={(el: HTMLElement) => adjustScrollForNavbar(el)}
            >
              Features
            </Nav.Link>
            <Nav.Link
              as={Link}
              smooth
              to="/#pricing"
              scroll={(el: HTMLElement) => adjustScrollForNavbar(el)}
            >
              Pricing
            </Nav.Link>
            <Nav.Link
              as={Link}
              smooth
              to="/#faq"
              scroll={(el: HTMLElement) => adjustScrollForNavbar(el)}
            >
              FAQ
            </Nav.Link>
            <Nav.Link
              as={Link}
              smooth
              to="/#contact"
              scroll={(el: HTMLElement) => adjustScrollForNavbar(el)}
            >
              Contact
            </Nav.Link>
          </Nav>
          {isAuthenticated ? (
            <Nav className="ms-auto">
              <Nav.Link className="tw-mr-12" href="/workspace">
                Workspace
              </Nav.Link>
              <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-basic">
                  <div className="tw-w-8 tw-h-8 tw-rounded-full tw-bg-[#26A1B0] tw-flex tw-items-center tw-justify-center tw-text-white tw-text-sm tw-font-bold tw-mx-auto tw-uppercase">
                    {firstInitial}
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="profile">Profile</Dropdown.Item>
                  <Dropdown.Item href="settings">Settings</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Button className="button button-login" onClick={openLoginModal}>
                Login
              </Button>
            </Nav>
          )}
          <LoginModal
            show={modalShow}
            handleClose={() => setModalShow(false)}
            title="Sign In"
            header="Choose how you want to sign in"
            onGoogleClick={navigateToGoogleLogin}
            onEmailClick={navigateToLogin}
          />
        </Navbar.Collapse>
        {modalGoogleShow && (
          <GoogleLoginModal
            show={modalGoogleShow}
            handleClose={handleGoogleModalClose}
          />
        )}
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
