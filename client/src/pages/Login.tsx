import { useState } from "react";
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
import VerificationCodeInput from "../components/shared/VerificationCodeInput";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../utils/common/handleActionMessage";

const Login: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showVerificationCode, setShowVerificationCode] =
    useState<boolean>(false);
  const [code, setCode] = useState<string>("");

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
      const resultAction = await dispatch(
        loginUser({ email, password })
      ).unwrap();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
      setTimeout(() => navigateToHome(), 2000);
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Login failed: ", errorMessage);
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
        const successMessage = handleSuccessMessage(resultAction);
        showSuccessToast(successMessage);
        setShowVerificationCode(true);
      } catch (error) {
        const errorMessage = handleErrorMessage(error);
        showErrorToast(errorMessage);
        console.error("Failed to send email: ", errorMessage);
      }
    }
  };

  const handleVerifyEmail = async (email: string, code: string) => {
    try {
      const resultAction = await dispatch(
        verifyEmail({ email, code })
      ).unwrap();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
      navigateToResetPassword();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Verification failed: ", error);
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
        actionLabel={showVerificationCode ? "Submit" : "Send"}
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
              <Form.Label className="tw-text-custom-color-blue tw-font-bold tw-text-sm tw-mt-3">
                Verification Code
              </Form.Label>
              <VerificationCodeInput code={code} setCode={setCode} />
            </Form.Group>
          )}
        </Form>
      </CustomModal>
    </Container>
  );
};

export default Login;
