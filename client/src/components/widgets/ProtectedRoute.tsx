// import { Navigate } from "react-router-dom";
// import { getToken } from "../../utils/login/handleAuthToken";
// import { ProtectedRouteProps } from "../../interfaces/interfaces";

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
//   const token = getToken();
//   return token ? element : <Navigate to="/" />;
// };

// export default ProtectedRoute;

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import apiService from "../../services/app/apiService";
import { ProtectedRouteProps } from "../../interfaces/interfaces";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  // Function to verify token with the backend
  const verifyToken = async () => {
    try {
      // Call your backend to verify the token
      const response = await apiService.postCall("/protected", {});
      if (response.status === 200) {
        setIsTokenValid(true); // Token is valid
      } else {
        setIsTokenValid(false); // Token is invalid or expired
      }
    } catch (error) {
      setIsTokenValid(false); // Handle error case, e.g., network failure
      console.log(error);
    }
  };

  useEffect(() => {
    verifyToken(); // Verify token on component mount
  }, []);

  // While checking token validity, show a loading state
  if (isTokenValid === null) {
    return <div>Loading...</div>; // Or a spinner or placeholder
  }

  // If token is valid, render the protected element, otherwise redirect to login
  return isTokenValid ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
