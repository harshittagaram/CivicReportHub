import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout, loading } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  if (loading) return <div className="text-center py-3">Loading Navbar...</div>;

  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg text-blue-700"
          : "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-bold text-lg tracking-wide flex items-center gap-2"
        >
          <i className="fas fa-globe text-blue-700 text-xl"></i>
          <span className="text-blue-700">EcoAware Portal</span>
        </Link>

        {/* Mobile Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden px-2 py-1 bg-blue-700 text-white rounded-md focus:outline-none hover:bg-blue-800 text-sm"
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:flex lg:items-center lg:space-x-2`}
        >
          <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-2">
            
            <Link
              to="/report"
              className="px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-200 no-underline"
            >
              Report Issue
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-reports"
                className="px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-200 no-underline"
              >
                My Complaints
              </Link>
            )}

            {/* Auth Buttons / Dropdown */}
            <div className="mt-2 lg:mt-0 flex items-center gap-2 relative">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-200 no-underline"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-200 no-underline"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="px-3 py-1 bg-blue-700 text-white rounded-md flex items-center gap-1 hover:bg-blue-800 transition duration-200 no-underline"
                  >
                    {user?.name || "Harshit"}
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>

                  {isDropdownOpen && (
                    <ul className="absolute right-0 mt-1 w-36 bg-white text-blue-700 rounded-md shadow-lg z-50">
                      <li>
                        <Link
                          to="/my-reports"
                          className="block px-3 py-1 hover:bg-gray-100 rounded-t-md no-underline"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          My Complaints
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded-b-md"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
