import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { FormData } from "../interfaces/interfaces";
import { showErrorToast } from "../utils/common/handleToast";
import { validateForm } from "../utils/common/validateForm";

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { isNameRequired, isEmailRequired, isMessageRequired } = validateForm(
      formData.name,
      formData.email,
      formData.message
    );

    if (isNameRequired) {
      showErrorToast("Name is required");
      return;
    }

    if (isEmailRequired) {
      showErrorToast("Email is required");
      return;
    }

    if (isMessageRequired) {
      showErrorToast("Message is required");
      return;
    }
  };

  return (
    <Container
      className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-gray-700"
      style={{ minHeight: "calc(100vh - 76px)" }}
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
