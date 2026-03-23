import React, { useEffect, useState, useRef } from "react";
import { ProtectedRouteProps } from "../../interfaces/interfaces";
import { useNavigation } from "../../utils/user/useNavigation";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { handleErrorMessage } from "../../utils/common/handleMessage";
import { showErrorToast } from "../../utils/common/handleToast";
import {
  useLazyVerifyTokenQuery,
  useRefreshTokenMutation,
} from "../../store/api/appApi";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const { navigateToHome } = useNavigation();
  const userEmail = useSelector((state: RootState) => state.user.userEmail);
  const [verifyToken] = useLazyVerifyTokenQuery();
  const [refreshToken] = useRefreshTokenMutation();
  const toastShown = useRef(false);

  useEffect(() => {
    const authToken = async () => {
      try {
        const resultAction = await verifyToken(undefined, true).unwrap();
        if (resultAction.userId) {
          setIsTokenValid(true);
        }
      } catch (error) {
        const status =
          typeof error === "object" && error && "status" in error
            ? Number((error as { status?: number }).status)
            : undefined;

        if (status === 401 || status === 403) {
          try {
            const refreshResult = await refreshToken({
              email: userEmail,
            }).unwrap();

            if (refreshResult.userId) {
              setIsTokenValid(true);
              return;
            }
          } catch (refreshError) {
            setIsTokenValid(false);
            const errorMessage = handleErrorMessage(refreshError);
            if (!toastShown.current) {
              showErrorToast(errorMessage);
              toastShown.current = true;
            }
            return;
          }
        }

        setIsTokenValid(false);
        const errorMessage = handleErrorMessage(error);

        if (!toastShown.current) {
          showErrorToast(errorMessage);
          toastShown.current = true;
        }
      }
    };

    authToken();
  }, [refreshToken, userEmail, verifyToken]);

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
