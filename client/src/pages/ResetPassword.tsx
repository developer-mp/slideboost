import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useNavigation } from "../utils/login/useNavigation";
import { validatePassword } from "../utils/login/validatePassword";
import { showErrorToast, showSuccessToast } from "../utils/common/handleToast";
import PasswordInput from "../components/widgets/PasswordInput";
import { updatePassword } from "../store/actions/userAction";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../utils/common/handleActionMessage";
import { setIsReset } from "../store/slices/userSlice";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { navigateToLogin } = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const email = useSelector((state: RootState) => state.user.userEmail);

  const handleResetPassword = async (
    e: React.MouseEvent<HTMLButtonElement>,
    password: string
  ) => {
    e.preventDefault();

    const { isPasswordRequired, isNotPattern, isNotMatch } = validatePassword(
      password,
      confirmPassword
    );

    if (isPasswordRequired) {
      showErrorToast("Password is required");
      return;
    }
    if (isNotPattern) {
      showErrorToast(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character"
      );
      return;
    }
    if (isNotMatch) {
      showErrorToast("Passwords do not match");
      return;
    }

    if (!isPasswordRequired && !isNotPattern && !isNotMatch) {
      try {
        const resultAction = await dispatch(
          updatePassword({ email, password })
        ).unwrap();
        const successMessage = handleSuccessMessage(resultAction);
        showSuccessToast(successMessage);
        dispatch(setIsReset(false));
        navigateToLogin();
      } catch (error) {
        const errorMessage = handleErrorMessage(error);
        showErrorToast(errorMessage);
        console.error("Error occurred while resetting the password: ", error);
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center tw-mt-12">
      <Row className="tw-w-96">
        <Col>
          <h3 className="tw-text-xl tw-font-bold tw-text-center tw-mb-8 tw-text-custom-color-blue">
            RESET PASSWORD
          </h3>
          <Form>
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
            <Button
              type="submit"
              className="button button-primary tw-mt-3"
              onClick={(e) => handleResetPassword(e, password)}
            >
              Reset Password
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
