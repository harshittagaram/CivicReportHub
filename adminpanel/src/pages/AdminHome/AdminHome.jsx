import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar/AdminSidebar";
import ReportCategoryFilter from "../../components/ReportCategoryFilter/ReportCategoryFilter";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminHome = () => {
  const [totalReports, setTotalReports] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [resolvedReports, setResolvedReports] = useState(0);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(0); // ✅ New state

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/api/admin/complaints"
        );
        const reports = res.data;

        if (!Array.isArray(reports)) {
          throw new Error("Expected an array of reports");
        }

        setTotalReports(reports.length);
        setPendingReports(
          reports.filter((r) => r.status?.toLowerCase() === "pending").length
        );
        setResolvedReports(
          reports.filter(
            (r) =>
              r.status?.toLowerCase() === "resolved" && r.userAccepted === true
          ).length
        );
        setAwaitingConfirmation(
          reports.filter(
            (r) =>
              r.status?.toLowerCase() === "resolved" && r.userAccepted === false
          ).length
        );
      } catch (error) {
        console.error(
          "Error fetching admin reports:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        <div className="mb-5">
          <h2 className="fw-bold">Welcome, Admin 👋</h2>
          <p className="text-muted">
            Here's a quick overview of what's happening.
          </p>
        </div>
        <div className="row g-4">
          <div className="col-md-3">
            <div className="card text-white bg-primary shadow-sm border-0">
              <div className="card-body">
                <Link to="/reports" className="text-white text-decoration-none">
                  <h6 className="card-title mb-2">Total Reports</h6>
                  <h3 className="card-text">{totalReports}</h3>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-dark bg-warning shadow-sm border-0">
              <div className="card-body">
                <Link
                  to="/pending-reports"
                  className="text-dark text-decoration-none"
                >
                  <h6 className="card-title mb-2">Pending Reports</h6>
                  <h3 className="card-text">{pendingReports}</h3>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-success shadow-sm border-0">
              <div className="card-body">
                <Link
                  to="/resolved-reports"
                  className="text-white text-decoration-none"
                >
                  <h6 className="card-title mb-2">Resolved Reports</h6>
                  <h3 className="card-text">{resolvedReports}</h3>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-secondary shadow-sm border-0">
              <div className="card-body">
                <Link
                  to="/awaiting-confirmation"
                  className="text-white text-decoration-none"
                >
                  <h6 className="card-title mb-2">Awaiting Confirmation</h6>
                  <h3 className="card-text">{awaitingConfirmation}</h3>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <ReportCategoryFilter />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
