import { useState, useRef } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { verifyEmail } from "../store/actions/userAction";
import { showErrorToast, showSuccessToast } from "../utils/toast";

const Verification: React.FC = () => {
  const userEmail = useSelector((state: RootState) => state.user.userEmail);

  const [code, setCode] = useState<string>("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const navigateToLogin = () => {
    navigate("/login");
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
      const successMessage = resultAction.message;
      showSuccessToast(successMessage);
      setTimeout(() => navigateToLogin(), 2000);
    } catch (error) {
      const errorMessage =
        (error as { message?: string }).message || "Verification failed";
      showErrorToast(errorMessage);
      console.error("Verification failed:", error);
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
              <Button
                variant="primary"
                type="submit"
                onClick={(e) => handleVerifyEmail(e, userEmail, code)}
                className="w-40 mt-3"
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
