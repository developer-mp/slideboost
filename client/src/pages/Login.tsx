import { useState, useRef } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { loginUser, verifyEmail } from "../store/actions/userAction";
import { useNavigation } from "../utils/login/useNavigation";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../utils/common/handleToast";
import { validateEmail } from "../utils/login/validateEmail";
import CustomModal from "../components/shared/CustomModal";
import { sendEmail } from "../store/actions/userAction";

const Login: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showVerificationCode, setShowVerificationCode] =
    useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const { navigateToHome, navigateToCreateAccount, navigateToResetPassword } =
    useNavigation();
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
        showErrorToast("An unexpected error occurred");
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const handleSend = async (email: string) => {
    const { isEmailRequired, isFormatInvalid } = validateEmail(email);

    if (isEmailRequired) {
      showWarningToast("Email is required");
      return;
    }
    if (isFormatInvalid) {
      showErrorToast("Invalid email format");
      return;
    }

    if (!isEmailRequired && !isFormatInvalid) {
      try {
        const resultAction = await dispatch(sendEmail({ email })).unwrap();
        const successMessage = resultAction.message;
        showSuccessToast(successMessage);
        setShowVerificationCode(true);
      } catch (error) {
        const errorMessage =
          (error as { message?: string }).message || "Failed to send email";
        showErrorToast(errorMessage);
        console.error("Failed to send email:", error);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      const newCode = code.split("");
      newCode[index] = value;
      setCode(newCode.join(""));

      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (!inputsRef.current[index]?.value) {
        if (index > 0) {
          inputsRef.current[index - 1]?.focus();
        }
      } else {
        const newCode = code.split("");
        newCode[index] = "";
        setCode(newCode.join(""));
      }
    }
  };

  const handleVerifyEmail = async (email: string, code: string) => {
    try {
      const resultAction = await dispatch(
        verifyEmail({ email, code })
      ).unwrap();
      const successMessage = resultAction.message;
      showSuccessToast(successMessage);
      navigateToResetPassword();
    } catch (error) {
      const errorMessage =
        (error as { message?: string }).message || "Verification failed";
      showErrorToast(errorMessage);
      console.error("Verification failed:", error);
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
            <div className="text-left tw-mt-2 tw-cursor-pointer tw-text-[#3F80BA] hover:tw-text-[#ef6c00] hover:tw-underline">
              <span onClick={() => setShowModal(true)}>Forgot password</span>
            </div>
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
      <CustomModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        title="Confirm Email To Reset Password"
        actionLabel={showVerificationCode ? "Reset" : "Send"}
        onAction={
          showVerificationCode
            ? () => handleVerifyEmail(email, code)
            : () => handleSend(email)
        }
      >
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
          {showVerificationCode && (
            <Form.Group
              controlId="formBasicVerificationCode"
              className="tw-mb-3"
            >
              <Form.Label className="tw-text-custom-color-blue tw-font-bold tw-text-sm">
                Verification Code
              </Form.Label>
              <div className="tw-flex tw-gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={code[index] || ""}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputsRef.current[index] = el)}
                    className="tw-w-10 tw-h-10 tw-text-center tw-text-lg tw-border tw-border-gray-300 tw-rounded"
                  />
                ))}
              </div>
            </Form.Group>
          )}
        </Form>
      </CustomModal>
    </Container>
  );
};

export default Login;
