import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar/AdminSidebar";
import ReportCategoryFilter from "../../components/ReportCategoryFilter/ReportCategoryFilter";
import axios from "axios";

const AdminHome = () => {
  const [totalReports, setTotalReports] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [resolvedReports, setResolvedReports] = useState(0);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/admin/complaints"); // Update if port/endpoint differs
        const reports = res.data;

        setTotalReports(reports.length);
        setPendingReports(
          reports.filter((r) => r.status.toLowerCase() === "pending").length
        );
        setResolvedReports(
          reports.filter((r) => r.status.toLowerCase() === "resolved").length
        );
      } catch (error) {
        console.error("Error fetching admin reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        <div className="mb-5">
          <h2 className="fw-bold">Welcome, Admin 👋</h2>
          <p className="text-muted">
            Here's a quick overview of what's happening.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card text-white bg-primary shadow-sm border-0">
              <div className="card-body">
                <h6 className="card-title mb-2">Total Reports</h6>
                <h3 className="card-text">{totalReports}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-dark bg-warning shadow-sm border-0">
              <div className="card-body">
                <h6 className="card-title mb-2">Pending Reports</h6>
                <h3 className="card-text">{pendingReports}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-success shadow-sm border-0">
              <div className="card-body">
                <h6 className="card-title mb-2">Resolved Reports</h6>
                <h3 className="card-text">{resolvedReports}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Component */}
        <div className="mt-5">
          <ReportCategoryFilter />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
