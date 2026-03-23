import { Container, Nav, Navbar } from "react-bootstrap";
import { Link as RouterLink } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <Navbar
      variant="dark"
      expand="lg"
      sticky="bottom"
      className="modern-footer tw-py-2"
    >
      <Container className="tw-flex tw-justify-between tw-items-center tw-gap-4">
        <div className="tw-flex tw-space-x-4 tw-items-center">
          <a
            href="https://www.linkedin.com/company/slideboostsaas/"
            className="text-light tw-opacity-90 hover:tw-opacity-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn size={20} />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61574695015652"
            className="text-light tw-opacity-90 hover:tw-opacity-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://www.instagram.com/slideboostsaas"
            className="text-light tw-opacity-90 hover:tw-opacity-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://x.com/SlideBoostSaaS"
            className="text-light tw-opacity-90 hover:tw-opacity-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://www.youtube.com/@SlideBoostSaaS"
            className="text-light tw-opacity-90 hover:tw-opacity-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube size={20} />
          </a>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="tw-flex tw-justify-center"
        >
          <Nav className="ml-auto tw-items-center tw-gap-1">
            <Nav.Link as={RouterLink} className="footer-link" to="/news">
              Updates
            </Nav.Link>
            <Nav.Link as={RouterLink} className="footer-link" to="/conditions">
              Terms
            </Nav.Link>
            <Nav.Link as={RouterLink} className="footer-link" to="/privacy">
              Privacy
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Text className="text-light tw-text-[0.9em] tw-opacity-80">
          © {new Date().getFullYear()} SlideBoost
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default Footer;
