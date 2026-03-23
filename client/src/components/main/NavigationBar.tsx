import { useState } from "react";
import { Button, Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { useNavigation } from "../../utils/user/useNavigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { HashLink as Link } from "react-router-hash-link";
import { getFirstChar } from "../../utils/user/getFirstChar";
import { adjustScrollForNavbar } from "../../utils/common/adjustScrollForNavbar";
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
import { useLogoutUserMutation } from "../../store/api/appApi";

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

  const { navigateToHome } = useNavigation();
  const [logoutUser] = useLogoutUserMutation();

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );

  const userName = useSelector((state: RootState) => state.user.userName);
  const firstInitial = getFirstChar(userName);

  const handleLogout = async () => {
    try {
      const resultAction = await logoutUser().unwrap();
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
    <Navbar expand="lg" className="sticky-top modern-navbar">
      <Container className="tw-py-3">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <img src={logo_text} alt="logo" className="tw-w-44 tw-mr-6" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto tw-items-center tw-gap-1">
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
            <Nav className="ms-auto tw-items-center tw-gap-3">
              <Nav.Link className="tw-mr-2" href="/workspace">
                Workspace
              </Nav.Link>
              <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-basic">
                  <div className="tw-w-9 tw-h-9 tw-rounded-full tw-bg-[#1F7BBF] tw-flex tw-items-center tw-justify-center tw-text-white tw-text-sm tw-font-bold tw-mx-auto tw-uppercase tw-shadow-md">
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
              <Button
                className="button button-login tw-px-6"
                onClick={openLoginModal}
              >
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
