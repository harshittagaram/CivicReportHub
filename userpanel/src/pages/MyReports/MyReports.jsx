import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { toast } from "react-toastify";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchReports = async () => {
    if (!token) {
      setError("Please log in to view your reports.");
      toast.error("Session expired. Please log in.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8081/api/user/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReports(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch reports", err.response || err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        toast.error("Session expired. Please log in.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to view reports.");
        toast.error("Unauthorized access.");
      } else {
        setError("Failed to load reports. Please try again.");
        toast.error("Failed to load reports.");
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchReports();
  };

  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4">My Reports</h2>
        <div className="mb-4 text-end">
          <button
            className="btn btn-primary"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
          >
            {isRefreshing || loading ? "Refreshing..." : "Refresh Reports"}
          </button>
        </div>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {loading ? (
          <p className="text-center">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-center">No reports found.</p>
        ) : (
          <div className="row">
            {reports.map((report) => (
              <div className="col-md-6 mb-4" key={report.id}>
                <div className="text-decoration-none text-dark">
                  <div className="card shadow-sm h-100">
                    {report.imageUrl && (
                      <img
                        src={report.imageUrl}
                        className="card-img-top"
                        alt="Reported Issue"
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{report.category}</h5>
                      <p className="card-text">
                        <strong>Description:</strong> {report.description}
                      </p>
                      <p className="card-text">
                        <strong>Location:</strong> {report.location}
                      </p>
                      <p className="card-text">
                        <strong>Date:</strong>{" "}
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                      <hr />
                      <p className="card-text">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`badge ${
                            report.status === "Pending"
                              ? "bg-secondary"
                              : report.status === "In Progress"
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                        >
                          {report.status}
                        </span>
                      </p>
                      {report.remarks && (
                        <p className="card-text">
                          <strong>Remarks:</strong> {report.remarks}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;