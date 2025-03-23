import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { FormDataProps } from "../../interfaces/interfaces";
import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/common/handleToast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../../utils/common/handleActionMessage";
import { sendContactForm } from "../../store/actions/userAction";
import { validateEmail } from "../../utils/user/validateEmail";
import { validateName } from "../../utils/user/validateName";

const Contact = () => {
  const [formData, setFormData] = useState<FormDataProps>({
    name: "",
    email: "",
    message: "",
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValidName = validateName(formData.name);
    const { isEmailRequired, isFormatInvalid } = validateEmail(formData.email);
    const isValidMessage = validateName(formData.message);

    if (!isValidName) {
      showErrorToast("Name is required");
      return;
    }

    if (isEmailRequired) {
      showErrorToast("Email is required");
      return;
    }

    if (isFormatInvalid) {
      showErrorToast("Invalid email format");
      return;
    }

    if (!isValidMessage) {
      showErrorToast("Message is required");
      return;
    }

    try {
      const resultAction = await dispatch(
        sendContactForm({ formData })
      ).unwrap();
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while sending the contact form: ", error);
    }
  };

  return (
    <Container
      className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-gray-700 tw-mt-16 lg:tw-mt-0"
      style={{
        minHeight: "calc(100vh - var(--navbar-height) - var(--footer-height))",
      }}
    >
      <h3 className="tw-text-custom-color-blue tw-font-bold tw-text-3xl md:tw-text-4xl tw-text-center tw-mb-8">
        FEEL FREE TO REACH OUT
      </h3>
      <Form
        className="tw-w-full tw-max-w-md tw-mx-auto"
        onSubmit={handleSubmit}
      >
        <Form.Group className="tw-mb-3">
          <Form.Label className="tw-text-custom-color-blue tw-font-bold tw-text-sm">
            Name:
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
          />
        </Form.Group>
        <Form.Group className="tw-mb-3">
          <Form.Label className="tw-text-custom-color-blue tw-font-bold tw-text-sm">
            Email:
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
          />
        </Form.Group>
        <Form.Group className="tw-mb-3">
          <Form.Label className="tw-text-custom-color-blue tw-font-bold tw-text-sm">
            Message:
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Your message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="input-field"
          />
        </Form.Group>
        <Button className="button button-primary tw-w-full" type="submit">
          Send
        </Button>
      </Form>
    </Container>
  );
};

export default Contact;
