import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { showErrorToast, showSuccessToast } from "../utils/common/handleToast";
import VerificationCodeInput from "../components/shared/VerificationCodeInput";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../utils/common/handleActionMessage";
import { setIsRegister } from "../store/slices/userSlice";
import CustomModal from "../components/shared/CustomModal";
import { useNavigation } from "../utils/user/useNavigation";
import {
  useSendEmailMutation,
  useVerifyEmailMutation,
} from "../store/api/appApi";

const Verification: React.FC = () => {
  const [showRequestCodeModal, setShowRequestCodeModal] =
    useState<boolean>(false);
  const userEmail = useSelector((state: RootState) => state.user.userEmail);
  const { isReset, isRegister } = useSelector((state: RootState) => state.user);

  const [code, setCode] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [verifyEmail] = useVerifyEmailMutation();
  const [sendEmail] = useSendEmailMutation();

  const { navigateToLogin, navigateToResetPassword } = useNavigation();

  const handleVerifyEmail = async (
    e: React.MouseEvent<HTMLButtonElement>,
    email: string,
    code: string,
  ) => {
    e.preventDefault();

    try {
      const resultAction = await verifyEmail({ email, code }).unwrap();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
      if (isReset && !isRegister) {
        navigateToResetPassword();
      } else {
        dispatch(setIsRegister(false));
        navigateToLogin();
      }
    } catch (error) {
      if ((error as { requestCode: boolean }).requestCode) {
        setShowRequestCodeModal(true);
      }
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while verifying the email:", error);
    }
  };

  const handleRequestNewCode = async () => {
    await sendEmail({
      email: userEmail,
      template: "verificationEmail",
      subject: "Account Verification",
    });
    setShowRequestCodeModal(false);
    setCode("");
  };

  return (
    <Container
      className="tw-flex tw-justify-center tw-items-center"
      style={{
        minHeight: "calc(100vh - var(--navbar-height) - var(--footer-height))",
      }}
    >
      <Row>
        <Col>
          <div className="tw-text-center">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4">
              Enter verification code
            </h2>
            <form className="tw-flex tw-flex-col tw-items-center">
              <VerificationCodeInput code={code} setCode={setCode} />
              <Button
                onClick={(e) => handleVerifyEmail(e, userEmail, code)}
                className="mt-3 button button-primary-auto"
                style={{ width: "17.5rem" }}
              >
                Verify
              </Button>
            </form>
          </div>
        </Col>
        <CustomModal
          show={showRequestCodeModal}
          handleClose={() => setShowRequestCodeModal(false)}
          title="Request a New Verification Code"
          actionLabel="Request"
          onAction={handleRequestNewCode}
          children="Your verification code has expired. Please request a new one to complete the registration"
        />
      </Row>
    </Container>
  );
};

export default Verification;
