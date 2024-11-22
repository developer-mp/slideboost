import { Container, Nav, Navbar } from "react-bootstrap";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <Navbar variant="dark" className="tw-mt-8 tw-py-4" expand="lg">
      <Container className="tw-flex tw-justify-between tw-items-center">
        <div className="tw-flex tw-space-x-4">
          <a
            href="https://linkedin.com"
            className="text-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn size={20} />
          </a>
          <a
            href="https://facebook.com"
            className="text-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://instagram.com"
            className="text-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://twitter.com"
            className="text-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://youtube.com"
            className="text-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube size={20} />
          </a>
        </div>
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="tw-flex tw-justify-center"
        >
          <Nav>
            <Nav.Link className="footer-link" href="/news">
              News
            </Nav.Link>
            <Nav.Link className="footer-link" href="/conditions">
              Terms & Conditions
            </Nav.Link>
            <Nav.Link className="footer-link" href="/privacy">
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
