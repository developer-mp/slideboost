// import axios from "axios";

// const API_URL = "http://localhost:3000/api";

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

// export const fetchProtectedData = async () => {
//   const token = getToken();

//   if (!token) throw new Error("No token found");

//   const response = await axios.get(`${API_URL}/auth/protected`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return response.data;
// };
