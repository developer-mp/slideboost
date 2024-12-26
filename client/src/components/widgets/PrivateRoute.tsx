import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../store/store";
import {
  PrivateRouteProps,
  PrivateRouteFlagState,
} from "../../interfaces/interfaces";

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, flag }) => {
  const userFlags = useSelector((state: RootState) => state.user);

  let isAuthorized = false;

  if (Array.isArray(flag)) {
    isAuthorized = flag.some(
      (f) => userFlags[f as keyof PrivateRouteFlagState]
    );
  } else {
    isAuthorized = userFlags[flag as keyof PrivateRouteFlagState];
  }

  if (!isAuthorized) {
    return <Navigate to="/" />;
  }

  return element;
};

export default PrivateRoute;
