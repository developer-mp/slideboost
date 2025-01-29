import { useEffect, useState } from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { useNavigation } from "../utils/login/useNavigation";
import { deactivateAccount, logoutUser } from "../store/actions/userAction";
import { updateUserName, updatePassword } from "../store/actions/userAction";
import { formatEmail } from "../utils/login/formatEmail";
import { validateName } from "../utils/login/validateName";
import { validatePassword } from "../utils/login/validatePassword";
import PasswordInput from "../components/widgets/PasswordInput";
import { showErrorToast, showSuccessToast } from "../utils/common/handleToast";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../utils/common/handleActionMessage";
import { getDeactivationReasons } from "../store/actions/dataAction";

const Settings: React.FC = () => {
  const userEmail = useSelector((state: RootState) => state.user.userEmail);
  const userAppName = useSelector((state: RootState) => state.user.userName);

  const dispatch = useDispatch<AppDispatch>();
  const { navigateToHome } = useNavigation();
  const formattedEmail = formatEmail(userEmail);

  const [activeKey, setActiveKey] = useState<string>("account");
  const [name, setName] = useState<string>(userAppName);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string>("");

  const { deactivationReasons, isFetchedReasons } = useSelector(
    (state: RootState) => state.dataStorage
  );

  const handleDeactivationReasons = async () => {
    try {
      await dispatch(getDeactivationReasons()).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while fetching the deactivation reasons: ",
        error
      );
    }
  };

  useEffect(() => {
    if (!isFetchedReasons) {
      handleDeactivationReasons();
    }
  });

  const options = [
    ...deactivationReasons.map((reason) => ({
      id: reason.id,
      label: reason.reason,
    })),
  ];

  const handleUpdateUserName = async (
    e: React.MouseEvent<HTMLButtonElement>,
    name: string,
    email: string
  ) => {
    e.preventDefault();

    const isValidName = validateName(name);

    if (!isValidName) {
      showErrorToast("Name is required");
      return;
    }

    try {
      const resultAction = await dispatch(
        updateUserName({ name, email })
      ).unwrap();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while updating the user name: ", error);
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
        const resultAction = await dispatch(
          updatePassword({ password, email })
        ).unwrap();
        const successMessage = handleSuccessMessage(resultAction);
        showSuccessToast(successMessage);
        setPassword("");
        setConfirmPassword("");
      } catch (error) {
        const errorMessage = handleErrorMessage(error);
        showErrorToast(errorMessage);
        console.error("Error occurred while updating the password: ", error);
      }
    }
  };

  const handleDeactivateAccount = async (reason: string) => {
    try {
      const resultAction = await dispatch(
        deactivateAccount({ email: userEmail, reason })
      ).unwrap();
      dispatch(logoutUser());
      navigateToHome();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
      setSelectedReason("");
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while deactivating the user account: ",
        error
      );
    }
  };

  return (
    <Container className="tw-text-center tw-mt-12 tw-mb-12">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="tw-px-4">
          <Card className="tw-shadow-xl tw-rounded-lg tw-bg-white tw-p-6">
            <Card.Body>
              <h3 className="tw-text-xl tw-font-bold tw-mb-8 tw-text-custom-color-blue">
                Your Settings
              </h3>
              <Tabs
                activeKey={activeKey}
                onSelect={(k) => setActiveKey(k as string)}
                id="profile-tabs"
                className="input-field mb-4 active-tab"
              >
                <Tab eventKey="account" title="Account">
                  <div>
                    <h3 className="tw-text-base tw-font-bold tw-text-gray-500 tw-text-left">
                      Personal Data
                    </h3>
                    <hr className="tw-border-t" />
                  </div>
                  <Form>
                    <Form.Group
                      controlId="formBasicName"
                      className="tw-mb-6 tw-mt-8"
                    >
                      <Row>
                        <Col md={3} className="d-flex align-items-center">
                          <Form.Label className="fw-bold tw-text-gray-500 tw-text-sm">
                            User Name
                          </Form.Label>
                        </Col>
                        <Col md={9} className="d-flex align-items-center">
                          <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field w-full"
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail" className="tw-mb-6">
                      <Row>
                        <Col md={3} className="d-flex align-items-center">
                          <Form.Label className="fw-bold tw-text-gray-500 tw-text-sm">
                            User Email
                          </Form.Label>
                        </Col>
                        <Col md={9} className="d-flex align-items-center">
                          <Form.Control
                            type="text"
                            value={formattedEmail}
                            disabled
                            className="input-field w-full"
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                    <Button
                      variant="secondary"
                      onClick={(e) => handleUpdateUserName(e, name, userEmail)}
                    >
                      Save Changes
                    </Button>
                  </Form>
                  <div>
                    <h3 className="tw-text-base tw-font-bold tw-text-gray-500 tw-text-left tw-mt-8">
                      Account Deactivation
                    </h3>
                    <hr className="tw-border-t" />
                  </div>
                  <Form.Group
                    controlId="formBasicConfirmPassword"
                    className="tw-mb-6 tw-mt-8"
                  >
                    <Row>
                      <Col md={3} className="d-flex align-items-center">
                        <Form.Label className="fw-bold tw-text-gray-500 tw-text-sm">
                          Select a reason
                        </Form.Label>
                      </Col>
                      <Col md={9} className="d-flex align-items-center">
                        <Dropdown className="tw-w-60">
                          <Dropdown.Toggle
                            id="dropdown-basic"
                            className="tw-w-full tw-h-9 dropdown-toggle-menu"
                          >
                            {selectedReason}
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="tw-w-full dropdown-menu">
                            {options.map(({ id, label }) => (
                              <Dropdown.Item
                                key={id}
                                onClick={() => setSelectedReason(label)}
                              >
                                {label}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </Form.Group>
                  <Button
                    variant="secondary"
                    disabled={!selectedReason}
                    onClick={() => handleDeactivateAccount(selectedReason)}
                  >
                    Deactivate Account
                  </Button>
                </Tab>
                <Tab eventKey="security" title="Security">
                  <div>
                    <h3 className="tw-text-base tw-font-bold tw-text-gray-500 tw-text-left tw-mt-8">
                      Set Password
                    </h3>
                    <hr className="tw-border-t" />
                  </div>
                  <Form>
                    <Form.Group
                      controlId="formBasicPassword"
                      className="tw-mb-6"
                    >
                      <Row>
                        <Col md={3} className="d-flex align-items-center">
                          <Form.Label className="fw-bold tw-text-gray-500 tw-text-sm">
                            New Password
                          </Form.Label>
                        </Col>
                        <Col md={9} className="d-flex align-items-center">
                          <PasswordInput
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field w-full"
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
                          <Form.Label className="fw-bold tw-text-gray-500 tw-text-sm">
                            Confirm Password
                          </Form.Label>
                        </Col>
                        <Col md={9} className="d-flex align-items-center">
                          <PasswordInput
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field w-full"
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                    <Button
                      variant="secondary"
                      onClick={(e) =>
                        handleUpdatePassword(e, password, userEmail)
                      }
                    >
                      Save Changes
                    </Button>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
