import { Button, Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { logout } from "../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { firstChar } from "../utils/firstChar";
import { useNavigation } from "./../utils/useNavigation";
import { handleNavClick } from "../utils/handleNavClick";
import logo_text from "../assets/logo_text.png";

const NavigationBar: React.FC = () => {
  const dispatch = useDispatch();
  const { navigateToHome } = useNavigation();

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const userName = useSelector((state: RootState) => state.user.userName);
  const firstInitial = firstChar(userName);

  const handleLogout = () => {
    navigateToHome();
    dispatch(logout());
  };

  return (
    <Navbar expand="lg" className="bg-light sticky-top">
      <Container className="tw-mt-4">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <img src={logo_text} alt="logo" className="tw-w-40 tw-mr-8" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => handleNavClick("home", navigateToHome)}>
              Home
            </Nav.Link>
            <Nav.Link onClick={() => handleNavClick("about", navigateToHome)}>
              About
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavClick("features", navigateToHome)}
            >
              Features
            </Nav.Link>
            <Nav.Link onClick={() => handleNavClick("pricing", navigateToHome)}>
              Pricing
            </Nav.Link>
            <Nav.Link onClick={() => handleNavClick("faq", navigateToHome)}>
              FAQ
            </Nav.Link>
            <Nav.Link onClick={() => handleNavClick("contact", navigateToHome)}>
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
                  <div className="tw-w-8 tw-h-8 tw-rounded-full tw-bg-[#EF6C00] tw-flex tw-items-center tw-justify-center tw-text-white tw-text-sm tw-font-bold tw-mx-auto tw-uppercase">
                    {firstInitial}
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="profile">Profile</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Button className="button-login" href="login">
                Login
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
