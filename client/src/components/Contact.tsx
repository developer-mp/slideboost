import { Form, Button, Container } from "react-bootstrap";

const Contact = () => {
  return (
    <Container className="tw-flex tw-flex-col tw-mt-6 tw-justify-center tw-items-center tw-text-gray-700 tw-mb-16">
      <div className="tw-bg-[#fdf8f4] tw-rounded-lg tw-shadow-lg tw-p-10 tw-max-w-full tw-mx-auto">
        <h3 className="tw-text-4xl tw-font-bold tw-mb-16">
          <span className="tw-text-custom-color-teal">
            FEEL FREE TO REACH OUT{" "}
          </span>
          <span className="tw-text-custom-color-blue">TO US</span>
        </h3>
        <Form className="tw-w-80">
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
          <Button className="custom-button" type="submit">
            Send
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Contact;
