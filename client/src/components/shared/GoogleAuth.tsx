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

const GoogleAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { navigateToHome } = useNavigation();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;

    if (!credential) {
      console.error("No credential received from Google login");
      return;
    }

    try {
      const resultAction = await dispatch(
        loginUserWithGoogle({ idToken: credential })
      ).unwrap();
      const successMessage = handleSuccessMessage(resultAction);
      showSuccessToast(successMessage);
      setTimeout(() => navigateToHome(), 2000);
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while logging in with Google: ", error);
    }

    // try {
    //   const response = await fetch("http://localhost:3000/api/v1/user/google", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ idToken: credential }),
    //   });

    //   const data = await response.json();
    //   console.log(data);

    //   if (data.success) {
    //     console.log("User authenticated with Google: ", data.user);
    //   } else {
    //     console.error("Google authentication failed: ", data);
    //   }
    // } catch (error) {
    //   console.error("Error occurred during Google login: ", error);
    // }
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
