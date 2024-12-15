import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { verifyEmail } from "../store/actions/userAction";
import { showErrorToast, showSuccessToast } from "../utils/common/handleToast";
import VerificationCodeInput from "../components/shared/VerificationCodeInput";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../utils/common/handleActionMessage";
import { setIsRegister } from "../store/slices/userSlice";

const Verification: React.FC = () => {
  const userEmail = useSelector((state: RootState) => state.user.userEmail);

  const [code, setCode] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const navigateToLogin = () => {
    navigate("/login");
  };

  const handleVerifyEmail = async (
    e: React.MouseEvent<HTMLButtonElement>,
    email: string,
    code: string
  ) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(
        verifyEmail({ email, code })
      ).unwrap();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
      dispatch(setIsRegister(false));
      setTimeout(() => navigateToLogin(), 2000);
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while verifying the email:", error);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col className="px-0 ">
          <div className="tw-bg-yellow-100 tw-text-yellow-800 tw-p-3 tw-text-center">
            <h6 className="tw-font-semibold">Do not refresh the page</h6>
          </div>
          <div className="tw-text-center tw-mt-16">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4">
              Enter verification code
            </h2>
            <form className="tw-flex tw-flex-col tw-items-center">
              <VerificationCodeInput code={code} setCode={setCode} />
              <Button
                variant="primary"
                type="submit"
                onClick={(e) => handleVerifyEmail(e, userEmail, code)}
                className="w-40 mt-3 button button-primary-auto"
              >
                Verify
              </Button>
            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Verification;
