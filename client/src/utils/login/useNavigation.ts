import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
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
    navigateToLogin,
    navigateToCreateAccount,
    navigateToResetPassword,
    navigateToWorkspace,
  };
};
