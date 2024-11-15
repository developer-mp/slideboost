import { Form, Button, Container } from "react-bootstrap";

const Contact = () => {
  return (
    <Container
      className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-gray-700"
      style={{ minHeight: "calc(100vh - 76px)" }}
    >
      <h3 className="tw-text-custom-color-blue tw-font-bold tw-text-3xl md:tw-text-4xl tw-text-center tw-mb-8">
        FEEL FREE TO REACH OUT
      </h3>
      <Form className="tw-w-full tw-max-w-md tw-mx-auto">
        <Form.Group className="tw-mb-3">
          <Form.Label className="tw-text-custom-color-blue tw-font-bold tw-text-sm">
            Name:
          </Form.Label>
          <Form.Control type="text" placeholder="Enter your name" />
        </Form.Group>
        <Form.Group className="tw-mb-3">
          <Form.Label className="tw-text-custom-color-blue tw-font-bold tw-text-sm">
            Email:
          </Form.Label>
          <Form.Control type="email" placeholder="Enter your email" />
        </Form.Group>
        <Form.Group className="tw-mb-3">
          <Form.Label className="tw-text-custom-color-blue tw-font-bold tw-text-sm">
            Message:
          </Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Your message" />
        </Form.Group>
        <Button className="button button-main tw-w-full" type="submit">
          Send
        </Button>
      </Form>
    </Container>
  );
};

export default Contact;
