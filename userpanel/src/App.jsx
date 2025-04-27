import { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import ReportNow from "./pages/ReportNow/ReportNow";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import MyReports from "./pages/MyReports/MyReports";
import UserReportDetail from "./pages/UserReportDetail/UserReportDetail";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const location = useLocation();

  useEffect(() => {
    // Update authentication status when token changes
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location]);

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
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
          path="/user/report/:id"
          element={
            <ProtectedRoute>
              <UserReportDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
