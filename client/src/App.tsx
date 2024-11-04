import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Privacy from "./pages/Privacy";
import Conditions from "./pages/Conditions";
import News from "./pages/News";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verification from "./pages/Verification";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import ToastProvider from "./components/ToastProvider";
import "./styles/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer";
import NavigationBar from "./components/NavigationBar";
import Workspace from "./pages/Workspace";

const App = () => {
  return (
    <Router>
      <div id="content-wrapper" className="tw-flex tw-flex-col tw-min-h-screen">
        <NavigationBar />
        <div className="tw-flex-grow">
          <Routes>
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/news" element={<News />} />
            <Route path="/conditions" element={<Conditions />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verification />} />
            <Route
              path="/profile"
              element={<ProtectedRoute element={<Profile />} />}
            />
            <Route path="*" element={<Main />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <ToastProvider />
    </Router>
  );
};

export default App;
