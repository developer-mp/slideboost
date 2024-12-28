import { Modal } from "react-bootstrap";
import GoogleAuth from "../shared/GoogleAuth";
import { GoogleLoginModalProps } from "../../interfaces/interfaces";

const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  show,
  handleClose,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login with Google</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <GoogleAuth onLoginStart={handleClose} />
      </Modal.Body>
    </Modal>
  );
};

export default GoogleLoginModal;
