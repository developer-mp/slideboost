import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { loginUserWithGoogle } from "../../store/actions/userAction";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../../utils/common/handleActionMessage";
import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/common/handleToast";
import { useNavigation } from "../../utils/login/useNavigation";
import { config } from "../../../env.config";

interface GoogleAuthProps {
  onLoginStart: () => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onLoginStart }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { navigateToWorkspace } = useNavigation();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;

    if (!credential) {
      console.error("No credential received from Google login");
      return;
    }

    try {
      onLoginStart();

      const resultAction = await dispatch(
        loginUserWithGoogle({ idToken: credential })
      ).unwrap();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
      navigateToWorkspace();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while logging in with Google: ", error);
    }
  };

  const handleGoogleError = () => {
    try {
      throw new Error("Google login error occurred");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={handleGoogleLogin} onError={handleGoogleError} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
