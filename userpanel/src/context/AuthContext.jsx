import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(false); // Start with false

  const fetchUser = async (token) => {
    try {
      const response = await axios.get("http://localhost:8081/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data)); // Cache user
      console.log("Token validation successful:", response.data);
    } catch (err) {
      console.error("Token validation failed:", err);
      setUser(null);
      setToken("");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const login = async (token) => {
    try {
      console.log("Storing token in localStorage:", token);
      localStorage.setItem("token", token);
      setToken(token);
      setLoading(true); // Set loading during login
      await fetchUser(token);
      navigate("/");
    } catch (error) {
      console.error("Failed to store token or fetch user:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken("");
      setUser(null);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Removing token from localStorage");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem("token");
      console.log("useEffect: Checking token:", storedToken || "No token");

      if (storedToken) {
        if (localStorage.getItem("user")) {
          // Use cached user if available
          console.log("Using cached user from localStorage");
          setToken(storedToken);
        } else {
          // Fetch user if no cached data
          console.log(
            "Validating token with API: http://localhost:8081/api/user/me"
          );
          await fetchUser(storedToken);
        }
      } else {
        console.log("No token found, setting user to null");
        setUser(null);
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token && !!user,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
