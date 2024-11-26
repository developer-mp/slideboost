import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import NavigationBar from "./components/main/NavigationBar";
import Workspace from "./pages/Workspace";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Verification from "./pages/Verification";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/widgets/ProtectedRoute";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import Conditions from "./pages/Conditions";
import News from "./pages/News";
import ToastProvider from "./components/shared/ToastProvider";
import Footer from "./components/main/Footer";
import "./styles/tailwind.css";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
            <Route path="/reset" element={<ResetPassword />} />
            <Route
              path="/profile"
              element={<ProtectedRoute element={<Profile />} />}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute element={<Settings />} />}
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
