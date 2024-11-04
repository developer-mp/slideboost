import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import { ProtectedRouteProps } from "../interfaces/interfaces";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const token = getToken();
  return token ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
