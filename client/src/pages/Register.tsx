import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { registerUser } from "../store/actions/userAction";
import { validateName } from "../utils/login/validateName";
import { validatePassword } from "../utils/login/validatePassword";
import { validateEmail } from "../utils/login/validateEmail";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../utils/common/handleToast";
import PasswordInput from "../components/widgets/PasswordInput";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../utils/common/handleActionMessage";

const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [checked, setChecked] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const navigateToVerification = () => {
    navigate("/verify");
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const handleRegisterUser = async (
    e: React.MouseEvent<HTMLButtonElement>,
    name: string,
    email: string,
    password: string
  ) => {
    e.preventDefault();

    const { isEmailRequired, isFormatInvalid } = validateEmail(email);

    if (isEmailRequired) {
      showWarningToast("Email is required");
      return;
    }
    if (isFormatInvalid) {
      showErrorToast("Invalid email format");
      return;
    }

    const isValidName = validateName(name);

    if (!isValidName) {
      showErrorToast("Name is required");
      return;
    }

    const { isPasswordRequired, isNotPattern, isNotMatch } = validatePassword(
      password,
      confirmPassword
    );

    if (isPasswordRequired) {
      showWarningToast("Password is required");
      return;
    }
    if (isNotPattern) {
      showWarningToast(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character"
      );
      return;
    }
    if (isNotMatch) {
      showErrorToast("Passwords do not match");
      return;
    }

    if (!checked) {
      showWarningToast(
        "You must agree to the Terms & Conditions and Privacy Notice"
      );
      return;
    }

    if (
      !isEmailRequired &&
      !isFormatInvalid &&
      isValidName &&
      !isPasswordRequired &&
      !isNotPattern &&
      !isNotMatch
    ) {
      try {
        const resultAction = await dispatch(
          registerUser({ name, email, password })
        ).unwrap();
        const successMessage = handleSuccessMessage(resultAction);
        showSuccessToast(successMessage);
        setTimeout(() => navigateToVerification(), 2000);
      } catch (error) {
        const errorMessage = handleErrorMessage(error);
        showErrorToast(errorMessage);
        console.error("Registration failed: ", errorMessage);
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center tw-mt-12">
      <Row className="tw-w-96">
        <Col>
          <h3 className="tw-text-xl tw-font-bold tw-text-center tw-mb-8 tw-text-custom-color-blue">
            CREATE ACCOUNT
          </h3>
          <Form>
            <Form.Group controlId="formBasicName" className="tw-mb-3">
              <Form.Label className="tw-text-custom-color-blue tw-font-bold tw-text-sm">
                Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first and last name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </Form.Group>
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
              <PasswordInput
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicConfirmPassword"
              className="tw-mb-3"
            >
              <Form.Label className="tw-text-custom-color-blue tw-font-bold tw-text-sm">
                Confirm password
              </Form.Label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="input-field"
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              id="terms"
              label={
                <>
                  I agree to the <a href="/conditions">Terms & Conditions</a>{" "}
                  and <a href="/privacy">Privacy Notice</a>
                </>
              }
              checked={checked}
              onChange={handleCheckboxChange}
              required
              className="tw-text-xs"
            />
            <Button
              type="submit"
              className="button button-primary"
              onClick={(e) => handleRegisterUser(e, name, email, password)}
            >
              Create Account
            </Button>
            <div className="text-center mt-5">
              <span>Already have an account? </span>
            </div>
            <Button
              variant="secondary"
              className="button button-secondary tw-mb-16"
              onClick={navigateToVerification}
            >
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
