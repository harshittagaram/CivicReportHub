import React, { useState, useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const payload = {
        name,
        email,
        password,
        role: "USER",
      };
      console.log("Sending register request with:", payload);
      const response = await axios.post(
        "http://localhost:8081/api/user/register",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Register API Response:", response.data);
      const { token } = response.data;
      if (!token) {
        throw new Error("No token received from API");
      }
      console.log("Register Token received:", token);
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again with different credentials.";
      setError(errorMessage);
      console.error("Register error:", {
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
            <i className="fas fa-user-plus fa-3x text-primary mb-3"></i>
            <h2>Citizen Registration</h2>
            <p>Join the EcoAware Portal to report environmental issues and contribute to a cleaner community</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <i className="fas fa-user me-1"></i>
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name as per government ID"
                required
                disabled={isLoading}
              />
            </div>
            
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
                placeholder="Enter your email address"
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
                placeholder="Create a strong password (minimum 6 characters)"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <i className="fas fa-lock me-1"></i>
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Privacy Notice:</strong> Your information is protected under government data protection guidelines. 
              We use your data only for environmental complaint management.
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus me-2"></i>
                  Register as Citizen
                </>
              )}
            </button>
            
            <div className="text-center mt-4">
              <p className="mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-primary fw-bold">
                  Sign In Here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
