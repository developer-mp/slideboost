import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToCreateAccount = () => {
    navigate("/register");
  };

  const navigateToWorkspace = () => {
    navigate("/workspace");
  };

  return {
    navigateToHome,
    navigateToCreateAccount,
    navigateToWorkspace,
  };
};
