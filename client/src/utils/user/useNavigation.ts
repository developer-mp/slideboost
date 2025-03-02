import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToVerify = () => {
    navigate("/verify");
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToCreateAccount = () => {
    navigate("/register");
  };

  const navigateToResetPassword = () => {
    navigate("/reset");
  };

  const navigateToWorkspace = () => {
    navigate("/workspace");
  };

  return {
    navigateToHome,
    navigateToVerify,
    navigateToLogin,
    navigateToCreateAccount,
    navigateToResetPassword,
    navigateToWorkspace,
  };
};
