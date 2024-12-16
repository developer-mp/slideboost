import { Button, Modal } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import { TfiEmail } from "react-icons/tfi";
import { LoginModalProps } from "../../interfaces/interfaces";

const LoginModal: React.FC<LoginModalProps> = ({
  show,
  handleClose,
  title = "Sign Up",
  header = "Use your email to continue with SlideBoost for free!",
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
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{header}</p>
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
