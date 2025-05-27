import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    console.log(
      "Initial token check:",
      token ? `Token found: ${token}` : "No token"
    );
    return !!token;
  });

  const login = (token) => {
    try {
      console.log("Storing token in localStorage:", token);
      localStorage.setItem("token", token);
      console.log("Token stored, verifying:", localStorage.getItem("token"));
      setIsAuthenticated(true);
      console.log("isAuthenticated set to true after login");
      navigate("/");
    } catch (error) {
      console.error("Failed to store token in localStorage:", error);
    }
  };

  const logout = () => {
    console.log("Removing token from localStorage");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    console.log("isAuthenticated set to false after logout");
    navigate("/login");
  };

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      console.log("useEffect: Checking token:", token || "No token");
      if (token) {
        try {
          console.log(
            "Validating token with API: http://localhost:8081/api/user/me"
          );
          console.log("Authorization header:", `Bearer ${token}`);
          const response = await axios.get(
            "http://localhost:8081/api/user/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Token validation successful:", response.data);
          setIsAuthenticated(true);
          console.log("isAuthenticated set to true after validation");
        } catch (err) {
          console.error("Token validation failed:", {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            headers: err.response?.headers,
          });
          console.log("Removing token and setting isAuthenticated to false");
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          navigate("/login");
        }
      } else {
        console.log("No token found, setting isAuthenticated to false");
        setIsAuthenticated(false);
      }
    };

    validateToken();

    const handleStorageChange = (e) => {
      if (e.key === "token") {
        console.log("Storage event: token changed to", e.newValue);
        setIsAuthenticated(!!e.newValue);
        console.log("isAuthenticated updated to:", !!e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
