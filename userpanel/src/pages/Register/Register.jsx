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
    if (password !== confirmPassword)
      return setError("Passwords do not match.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");

    setIsLoading(true);
    setError("");

    try {
      const payload = { name, email, password, role: "USER" };
      const response = await axios.post(
        "http://localhost:8081/api/user/register",
        payload
      );
      const { token } = response.data;
      if (!token) throw new Error("No token received");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex justify-center items-center pt-24 px-4">
        <div className="bg-white shadow rounded-lg w-full max-w-md p-6">
          <div className="text-center mb-6">
            <i className="fas fa-user-plus text-blue-600 text-3xl mb-2"></i>
            <h2 className="text-xl font-semibold text-gray-800">
              Citizen Registration
            </h2>
            <p className="text-sm text-gray-500">
              Join the EcoAware Portal to report issues & help your community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
                <i className="fas fa-exclamation-circle mr-1"></i>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-user mr-1"></i> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Your full name"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-envelope mr-1"></i> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Email"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-lock mr-1"></i> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Minimum 6 characters"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-lock mr-1"></i> Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Re-enter password"
                disabled={isLoading}
                required
              />
            </div>

            <div className="bg-blue-50 text-blue-800 p-2 rounded text-sm">
              <i className="fas fa-info-circle mr-1"></i>
              <strong>Privacy Notice:</strong> Your information is protected
              under government data protection guidelines.
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Creating
                  Account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-2"></i> Register as Citizen
                </>
              )}
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign In Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
