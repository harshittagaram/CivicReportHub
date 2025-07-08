import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide navbar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsVisible(true);
      }
      
      // Update scrolled state for background
      setScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav 
      className={`navbar navbar-expand-lg fixed-top ${scrolled ? "scrolled" : ""}`}
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1050
      }}
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-shield-alt"></i>
          <span>EcoAware Portal</span>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center" style={{ display: 'flex', flexWrap: 'nowrap' }}>
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Citizen Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="fas fa-user-plus me-1"></i>
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/report">
                    <i className="fas fa-exclamation-triangle me-1"></i>
                    Report Issue
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-reports">
                    <i className="fas fa-list-alt me-1"></i>
                    My Complaints
                  </Link>
                </li>
                {user && (
                  <li className="nav-item d-flex align-items-center px-2" style={{color: '#fff', fontWeight: 500}}>
                    <i className="fas fa-user-circle me-1"></i>
                    {user.name || user.email || "User"}
                  </li>
                )}
                <li className="nav-item" style={{minWidth: 110}}>
                  <button
                    className="btn btn-outline ms-2"
                    onClick={logout}
                    style={{ 
                      borderColor: 'rgba(255,255,255,0.5)', 
                      color: 'white',
                      background: 'transparent',
                      minWidth: 100
                    }}
                  >
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
