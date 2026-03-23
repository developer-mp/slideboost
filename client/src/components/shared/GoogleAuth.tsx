import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import {
  handleErrorMessage,
  handleSuccessMessage,
} from "../../utils/common/handleActionMessage";
import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/common/handleToast";
import { useNavigation } from "../../utils/user/useNavigation";
import { config } from "../../../env.config";
import { GoogleAuthProps } from "../../interfaces/interfaces";
import { useLoginUserWithGoogleMutation } from "../../store/api/appApi";

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onLoginStart }) => {
  const { navigateToWorkspace } = useNavigation();
  const [loginUserWithGoogle] = useLoginUserWithGoogleMutation();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;

    if (!credential) {
      console.error("No credential received from Google login");
      return;
    }

    try {
      onLoginStart();

      const resultAction = await loginUserWithGoogle({
        idToken: credential,
      }).unwrap();
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
