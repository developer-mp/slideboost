import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { loginUser } from "../store/actions/userAction";
import { useNavigation } from "../utils/login/useNavigation";
import { showErrorToast, showSuccessToast } from "../utils/common/handleToast";
import { validateEmail } from "../utils/login/validateEmail";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { navigateToHome, navigateToCreateAccount } = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const handleLoginUser = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    const { isEmailRequired, isFormatInvalid } = validateEmail(email);

    if (isEmailRequired) {
      showErrorToast("Email is required");
      return;
    }
    if (isFormatInvalid) {
      showErrorToast("Invalid email format");
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      showSuccessToast("Login successful");
      setTimeout(() => navigateToHome(), 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showErrorToast("Error logging in");
        console.error("Error logging in:", error.message);
      } else {
        showErrorToast("Error logging in");
        console.error("Error logging in:", error);
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center tw-mt-12">
      <Row className="tw-w-96">
        <Col xs={16} md={14} lg={12}>
          <h3 className="tw-text-xl tw-font-bold tw-text-center tw-mb-8 tw-text-custom-color-blue">
            LOGIN
          </h3>
          <Form>
            <Form.Group controlId="formBasicEmail" className="tw-mb-3">
              <Form.Label className="tw-text-custom-color-blue tw-font-bold tw-text-sm">
                Email address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="tw-mb-3">
              <Form.Label className="tw-text-custom-color-blue tw-font-bold tw-text-sm">
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </Form.Group>
            <Button
              type="submit"
              className="button button-primary tw-mt-3"
              onClick={handleLoginUser}
            >
              Login
            </Button>
            <div className="text-center tw-mt-10">
              <span>Don't have an account? </span>
            </div>
            <Button
              className="button button-secondary tw-mt-3"
              onClick={navigateToCreateAccount}
            >
              Create account
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
