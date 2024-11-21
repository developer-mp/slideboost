import { Container, Nav, Navbar } from "react-bootstrap";
import logo from "../../assets/main/logo.png";

const Footer = () => {
  return (
    <Navbar variant="dark" className="tw-mt-8">
      <Container className="tw-flex tw-justify-between tw-items-center">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <img src={logo} alt="logo" className="tw-w-8" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="tw-flex tw-justify-center"
        >
          <Nav>
            <Nav.Link className="footer-link" href="news">
              News
            </Nav.Link>
            <Nav.Link className="footer-link" href="conditions">
              Terms & Conditions
            </Nav.Link>
            <Nav.Link className="footer-link" href="privacy">
              Privacy Notice
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Text className="text-light tw-text-[0.9em]">
          © {new Date().getFullYear()} SlideBoost
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default Footer;
