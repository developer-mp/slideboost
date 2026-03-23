import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { setIsReset } from "../store/slices/userSlice";
import { useNavigation } from "../utils/user/useNavigation";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../utils/common/handleToast";
import { validateEmail } from "../utils/user/validateEmail";
import CustomModal from "../components/shared/CustomModal";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../utils/common/handleActionMessage";
import {
  useLoginUserMutation,
  useSendEmailMutation,
} from "../store/api/appApi";

const Login: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { navigateToWorkspace, navigateToCreateAccount, navigateToVerify } =
    useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [loginUser] = useLoginUserMutation();
  const [sendEmail] = useSendEmailMutation();

  const handleLoginUser = async (
    event: React.MouseEvent<HTMLButtonElement>,
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
      const resultAction = await loginUser({ email, password }).unwrap();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
      navigateToWorkspace();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while logging in: ", error);
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
        const resultAction = await sendEmail({
          email,
          template: "forgotPasswordEmail",
          subject: "Reset Password",
        }).unwrap();
        const successMessage = handleSuccessMessage(resultAction);
        showSuccessToast(successMessage);
        navigateToVerify();
        dispatch(setIsReset(true));
      } catch (error) {
        const errorMessage = handleErrorMessage(error);
        showErrorToast(errorMessage);
        console.error("Error occurred while sending the email: ", error);
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
        actionLabel="Send"
        onAction={() => handleSend(email)}
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
        </Form>
      </CustomModal>
    </Container>
  );
};

export default Login;
