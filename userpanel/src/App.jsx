import { useContext } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import { Route, Routes, Navigate } from "react-router-dom";
import ReportNow from "./pages/ReportNow/ReportNow";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import MyReports from "./pages/MyReports/MyReports";
import UserReportDetail from "./pages/UserReportDetail/UserReportDetail";
import { AuthContext } from "./context/AuthContext";
import { toast } from "react-toastify";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const GuestRoute = ({ children, type }) => {
    if (isAuthenticated) {
      toast.dismiss();
      toast.info(
        type === "register"
          ? "You are already registered and logged in."
          : "You are already logged in."
      );
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportNow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reports"
          element={
            <ProtectedRoute>
              <MyReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-detail/:id"
          element={
            <ProtectedRoute>
              <UserReportDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute type="login">
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute type="register">
              <Register />
            </GuestRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
