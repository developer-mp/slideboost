import { useState } from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { Form, Container, Button, Row, Col, Tab, Tabs } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { updateUserName, updatePassword } from "../store/actions/userAction";
import { formatEmail } from "../utils/login/formatEmail";
import { validateName } from "../utils/login/validateName";
import { validatePassword } from "../utils/login/validatePassword";
import { showErrorToast, showSuccessToast } from "../utils/common/handleToast";
import PasswordInput from "../components/widgets/PasswordInput";

const Profile: React.FC = () => {
  const userEmail = useSelector((state: RootState) => state.user.userEmail);
  const userAppName = useSelector((state: RootState) => state.user.userName);

  const dispatch = useDispatch<AppDispatch>();
  const formattedEmail = formatEmail(userEmail);

  const [activeKey, setActiveKey] = useState<string>("account");
  const [name, setName] = useState<string>(userAppName);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleUpdateUserName = async (
    e: React.MouseEvent<HTMLButtonElement>,
    name: string,
    email: string
  ) => {
    e.preventDefault();

    const isValidName = validateName(name);

    if (isValidName) {
      try {
        await dispatch(updateUserName({ name, email })).unwrap();
        showSuccessToast("User name updated successfully");
      } catch (error: unknown) {
        if (error instanceof Error) {
          showErrorToast("Error updating user name");
          console.error("Error updating user name:", error.message);
        } else {
          showErrorToast("Error updating user name");
          console.error("Error updating user name:", error);
        }
      }
    } else {
      showErrorToast("Name is required");
    }
  };

  const handleUpdatePassword = async (
    e: React.MouseEvent<HTMLButtonElement>,
    password: string,
    email: string
  ) => {
    e.preventDefault();

    const { isPasswordRequired, isNotPattern, isNotMatch } = validatePassword(
      password,
      confirmPassword
    );

    if (isPasswordRequired) {
      showErrorToast("Password is required");
    }
    if (isNotPattern) {
      showErrorToast(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character"
      );
    }
    if (isNotMatch) {
      showErrorToast("Passwords do not match");
    }

    if (!isPasswordRequired && !isNotPattern && !isNotMatch) {
      try {
        await dispatch(updatePassword({ password, email })).unwrap();
        // await userService.updatePassword(password, email);
        showSuccessToast("Password updated successfully");
        setPassword("");
        setConfirmPassword("");
      } catch (error: unknown) {
        if (error instanceof Error) {
          showErrorToast("Error updating user password");
          console.error("Error updating user password:", error.message);
        } else {
          showErrorToast("Error updating user password");
          console.error("Error updating user password:", error);
        }
      }
    }
  };

  return (
    <Container className="tw-text-center tw-mt-12">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="tw-px-4">
          <h3 className="tw-text-xl tw-font-bold tw-mb-8">Your Profile</h3>
          <Tabs
            activeKey={activeKey}
            onSelect={(k) => setActiveKey(k as string)}
            id="profile-tabs"
            className="mb-5"
          >
            <Tab eventKey="account" title="Account">
              <Form>
                <Form.Group controlId="formBasicName" className="tw-mb-6">
                  <Row>
                    <Col md={3} className="d-flex align-items-center">
                      <Form.Label className="fw-bold mb-1 text-end">
                        User Name
                      </Form.Label>
                    </Col>
                    <Col md={9} className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group controlId="formBasicEmail" className="tw-mb-6">
                  <Row>
                    <Col md={3} className="d-flex align-items-center">
                      <Form.Label className="fw-bold mb-1 text-end">
                        User Email
                      </Form.Label>
                    </Col>
                    <Col md={9} className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        value={formattedEmail}
                        disabled
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Button
                  variant="secondary"
                  className="w-20 mt-3"
                  onClick={(e) => handleUpdateUserName(e, name, userEmail)}
                >
                  Save Changes
                </Button>
              </Form>
            </Tab>
            <Tab eventKey="security" title="Security">
              <Form>
                <Form.Group controlId="formBasicPassword" className="tw-mb-6">
                  <Row>
                    <Col md={3} className="d-flex align-items-center">
                      <Form.Label className="fw-bold mb-1 text-end">
                        Password
                      </Form.Label>
                    </Col>
                    <Col md={9} className="d-flex align-items-center">
                      <PasswordInput
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group
                  controlId="formBasicConfirmPassword"
                  className="tw-mb-6"
                >
                  <Row>
                    <Col md={3} className="d-flex align-items-center">
                      <Form.Label className="fw-bold mb-1 text-end">
                        Confirm Password
                      </Form.Label>
                    </Col>
                    <Col md={9} className="d-flex align-items-center">
                      <PasswordInput
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Button
                  variant="secondary"
                  className="w-20 mt-3"
                  onClick={(e) => handleUpdatePassword(e, password, userEmail)}
                >
                  Save Changes
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
