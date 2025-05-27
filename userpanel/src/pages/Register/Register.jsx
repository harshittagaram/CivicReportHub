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
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        "Registration failed";
      setError(errorMessage);
      console.error("Register error:", {
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
          <h2 className="text-center mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              Register
            </button>
            <div className="mt-4">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
