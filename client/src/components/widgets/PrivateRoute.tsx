import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { PrivateRouteProps } from "../../interfaces/interfaces";

const PrivateRoute = ({ element, flag }: PrivateRouteProps) => {
  const flagValue = useSelector((state: RootState) => state.user[flag]);

  if (flagValue !== true) {
    return <Navigate to="/" />;
  }

  return element;
};

export default PrivateRoute;
