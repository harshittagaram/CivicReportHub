import React, { useState, useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Sending login request with:", { email, password });
      const response = await axios.post(
        "http://localhost:8081/api/user/login",
        { email, password }
      );
      console.log("Login API Response:", response.data);
      const { token } = response.data;
      if (!token) {
        throw new Error("No token received from API");
      }
      console.log("Calling login with token:", token);
      login(token);
      console.log(
        "Login function called, checking localStorage:",
        localStorage.getItem("token")
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials and try again.";
      setError(errorMessage);
      console.error("Login error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", paddingTop: "80px" }}>
        <div className="form-container">
          <div className="form-header">
            <i className="fas fa-user-circle fa-3x text-primary mb-3"></i>
            <h2>Citizen Login</h2>
            <p>Access your EcoAware Portal account to report environmental issues</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <i className="fas fa-envelope me-1"></i>
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email address"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <i className="fas fa-lock me-1"></i>
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Sign In
                </>
              )}
            </button>
            
            <div className="text-center mt-4">
              <p className="mb-0">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary fw-bold">
                  Register as a Citizen
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
