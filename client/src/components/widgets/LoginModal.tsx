import { Button, Modal } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import { TfiEmail } from "react-icons/tfi";

interface LoginModalProps {
  show: boolean;
  handleClose: () => void;
  onGoogleClick: () => void;
  onEmailClick: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  show,
  handleClose,
  onGoogleClick,
  onEmailClick,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-dialog"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Use your email to continue with SlideBoost for free!</p>
        <Button
          className="login-choice"
          onClick={() => {
            onGoogleClick();
            handleClose();
          }}
        >
          <FcGoogle className="tw-mr-5 tw-text-2xl" />
          Continue with Google
        </Button>
        <Button
          className="login-choice"
          onClick={() => {
            onEmailClick();
            handleClose();
          }}
        >
          <TfiEmail className="tw-mr-5 tw-text-2xl" />
          Continue with Email
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
