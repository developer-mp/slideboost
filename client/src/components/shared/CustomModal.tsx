import { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { CustomModalProps } from "../../interfaces/interfaces";

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
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button className="button button-secondary-auto" onClick={handleClose}>
          Cancel
        </Button>
        {actionLabel && (
          <Button className="button button-primary-auto" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
