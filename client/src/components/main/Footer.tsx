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
    <Navbar variant="dark" expand="lg" sticky="bottom">
      <Container className="tw-flex tw-justify-between tw-items-center">
        <div className="tw-flex tw-space-x-4">
          <a
            href="https://www.linkedin.com/company/slideboostsaas/"
            className="text-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn size={20} />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61574695015652"
            className="text-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://www.instagram.com/slideboostsaas"
            className="text-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://x.com/SlideBoostSaaS"
            className="text-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://www.youtube.com/@SlideBoostSaaS"
            className="text-light"
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
          <Nav className="ml-auto">
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
