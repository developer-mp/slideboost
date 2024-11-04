import { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

interface CustomModalProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  children: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  show,
  handleClose,
  title,
  children,
  actionLabel,
  onAction,
}) => {
  useEffect(() => {
    const contentWrapper = document.getElementById("content-wrapper");
    if (show && contentWrapper) {
      contentWrapper.classList.add("blur-background");
    } else if (contentWrapper) {
      contentWrapper.classList.remove("blur-background");
    }
    return () => {
      if (contentWrapper) {
        contentWrapper.classList.remove("blur-background");
      }
    };
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="custom-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "1.2em" }}>{children}</Modal.Body>
      <Modal.Footer>
        <Button className="button-secondary" onClick={handleClose}>
          Cancel
        </Button>
        {actionLabel && (
          <Button className="custom-button" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
