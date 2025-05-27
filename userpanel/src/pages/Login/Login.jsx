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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        "Login failed";
      setError(errorMessage);
      console.error("Login error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="col-md-6 col-lg-5 shadow p-4 rounded bg-light">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-danger mb-3">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
            <div className="mt-4">
              Don't have an account? <Link to="/register">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
