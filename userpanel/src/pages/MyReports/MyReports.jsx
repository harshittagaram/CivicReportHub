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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="badge badge-warning">Pending</span>;
      case "In Progress":
        return <span className="badge badge-info">In Progress</span>;
      case "Resolved":
        return <span className="badge badge-success">Resolved</span>;
      default:
        return <span className="badge badge-warning">Pending</span>;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Garbage":
        return "fas fa-trash";
      case "Drainage":
        return "fas fa-water";
      case "WaterPollution":
        return "fas fa-tint";
      case "AirPollution":
        return "fas fa-wind";
      case "Road Damage":
        return "fas fa-road";
      default:
        return "fas fa-exclamation-triangle";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <div className="container" style={{ paddingTop: "100px", paddingBottom: "50px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>
              <i className="fas fa-list-alt me-2 text-primary"></i>
              My Environmental Complaints
            </h2>
            <p className="text-[var(--text-secondary)] mb-0">
              Track the status of your reported environmental issues
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
          >
            {isRefreshing || loading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Refreshing...
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <i className="fas fa-spinner fa-spin fa-3x text-primary mb-3"></i>
            <p>Loading your complaints...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-5">
            <div className="card">
              <div className="card-body">
                <i className="fas fa-inbox fa-4x text-[var(--text-muted)] mb-3"></i>
                <h4>No Complaints Found</h4>
                <p className="text-[var(--text-secondary)]">
                  You haven't reported any environmental issues yet.
                </p>
                <Link to="/report" className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>
                  Report Your First Issue
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {reports.map((report) => (
              <div className="col-lg-6 col-md-12 mb-4" key={report.id}>
                <div className="card h-100">
                  {report.imageUrl && (
                    <div className="position-relative">
                      <img
                        src={report.imageUrl}
                        className="card-img-top"
                        alt="Reported Environmental Issue"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        {getStatusBadge(report.status)}
                      </div>
                    </div>
                  )}
                  
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="card-title mb-1">
                          <i className={`${getCategoryIcon(report.category)} me-2 text-primary`}></i>
                          {report.category}
                        </h5>
                        <small className="text-[var(--text-muted)]">
                          <i className="fas fa-calendar me-1"></i>
                          Reported on {new Date(report.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </small>
                      </div>
                      {!report.imageUrl && (
                        <div>
                          {getStatusBadge(report.status)}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <h6 className="text-[var(--text-primary)] mb-2">
                        <i className="fas fa-file-alt me-1"></i>
                        Issue Description
                      </h6>
                      <p className="card-text text-[var(--text-secondary)]">
                        {report.description && report.description.length > 100 
                          ? `${report.description.substring(0, 100)}...` 
                          : report.description}
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <h6 className="text-[var(--text-primary)] mb-2">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        Location
                      </h6>
                      <p className="card-text text-[var(--text-secondary)]">
                        {report.location}
                      </p>
                    </div>
                    
                    {report.remarks && (
                      <div className="mb-3">
                        <h6 className="text-[var(--text-primary)] mb-2">
                          <i className="fas fa-comment me-1"></i>
                          Authority Remarks
                        </h6>
                        <div className="alert alert-info">
                          <i className="fas fa-info-circle me-2"></i>
                          {report.remarks.length > 80 
                            ? `${report.remarks.substring(0, 80)}...` 
                            : report.remarks}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-footer bg-transparent">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-[var(--text-muted)]">
                        <i className="fas fa-clock me-1"></i>
                        Last updated: {new Date(report.updatedAt || report.createdAt).toLocaleDateString()}
                      </small>
                      <Link 
                        to={`/report-detail/${report.id}`} 
                        className="btn btn-outline btn-sm"
                      >
                        <i className="fas fa-eye me-1"></i>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {reports.length > 0 && (
          <div className="text-center mt-4">
            <Link to="/report" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Report New Issue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;