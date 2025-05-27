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

function App() {
  const { isAuthenticated } = useContext(AuthContext);

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
