import React, { useEffect, useState, useRef } from "react";
import { ProtectedRouteProps } from "../../interfaces/interfaces";
import { useNavigation } from "../../utils/login/useNavigation";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { verifyToken } from "../../store/actions/userAction";
import { handleErrorMessage } from "../../utils/common/handleActionMessage";
import { showErrorToast } from "../../utils/common/handleToast";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const { navigateToHome } = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const toastShown = useRef(false);

  useEffect(() => {
    const authToken = async () => {
      try {
        const resultAction = await dispatch(verifyToken()).unwrap();
        if (resultAction.userId) {
          setIsTokenValid(true);
        }
      } catch (error) {
        setIsTokenValid(false);
        const errorMessage = handleErrorMessage(error);
        console.error("Access restricted: ", error);

        if (!toastShown.current) {
          showErrorToast(errorMessage);
          toastShown.current = true;
        }
      }
    };

    authToken();
  }, [dispatch]);

  useEffect(() => {
    if (isTokenValid === false) {
      navigateToHome();
    }
  }, [isTokenValid, navigateToHome]);

  if (!isTokenValid) {
    return null;
  }

  return element;
};

export default ProtectedRoute;
