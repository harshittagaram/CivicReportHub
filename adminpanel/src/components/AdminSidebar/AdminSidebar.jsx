import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../AdminSidebar/AdminSidebar.css";

const AdminSidebar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <div className="d-flex">
      {/* Toggle Button (Visible on all screen sizes) */}
      <button className="btn btn-outline-secondary m-3" onClick={toggleSidebar}>
        {sidebarVisible ? "Hide Menu" : "Show Menu"}
      </button>

      {/* Sidebar */}
      {sidebarVisible && (
        <div className="admin-sidebar bg-dark text-white">
          <h4 className="p-3 border-bottom">Admin Panel</h4>
          <ul className="nav flex-column px-3">
            <li className="nav-item mb-2">
              <Link to="/" className="nav-link text-white">
                Home
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/reports" className="nav-link text-white">
                Reports List
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/resolved-reports" className="nav-link text-white">
                Resolved Reports
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
