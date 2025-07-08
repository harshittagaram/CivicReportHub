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
  const [user, setUser] = useState(null);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/user/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
    } catch (err) {
      setUser(null);
    }
  };

  const login = async (token) => {
    try {
      console.log("Storing token in localStorage:", token);
      localStorage.setItem("token", token);
      console.log("Token stored, verifying:", localStorage.getItem("token"));
      setIsAuthenticated(true);
      console.log("isAuthenticated set to true after login");
      await fetchUser(token);
      navigate("/");
    } catch (error) {
      console.error("Failed to store token in localStorage:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = () => {
    console.log("Removing token from localStorage");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    console.log("isAuthenticated set to false after logout");
    setUser(null);
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
          await fetchUser(token);
          console.log("Token validation successful:", user);
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
          setUser(null);
          navigate("/login");
        }
      } else {
        console.log("No token found, setting isAuthenticated to false");
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    validateToken();

    const handleStorageChange = (e) => {
      if (e.key === "token") {
        console.log("Storage event: token changed to", e.newValue);
        setIsAuthenticated(!!e.newValue);
        console.log("isAuthenticated updated to:", !!e.newValue);
        if (e.newValue) {
          fetchUser(e.newValue);
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
