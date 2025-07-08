import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar/Navbar";

const UserReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReportDetails = async () => {
    try {
      console.log("Fetching user report with ID:", id);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8081/api/user/complaints/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("UserReportDetail API Response:", response.data);
      setReport(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching report details:", error.response || error);
      setError("Failed to load report details.");
      toast.error("Failed to load report details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchReportDetails();
    else {
      setError("Invalid report ID.");
      setLoading(false);
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this environmental complaint? This action cannot be undone."))
      return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8081/api/user/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Environmental complaint deleted successfully!");
      navigate("/my-reports");
    } catch (error) {
      console.error("Error deleting complaint:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Failed to delete complaint."
      );
    } finally {
      setIsDeleting(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", paddingTop: "80px" }}>
          <div className="text-center">
            <i className="fas fa-spinner fa-spin fa-3x text-primary mb-3"></i>
            <p className="text-[var(--text-secondary)]">Loading complaint details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", paddingTop: "80px" }}>
          <div className="text-center">
            <i className="fas fa-exclamation-triangle fa-3x text-error mb-3"></i>
            <p className="text-[var(--text-secondary)]">{error}</p>
            <Link to="/my-reports" className="btn btn-primary mt-3">
              <i className="fas fa-arrow-left me-2"></i>
              Back to My Complaints
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", paddingTop: "80px" }}>
          <div className="text-center">
            <i className="fas fa-file-alt fa-3x text-[var(--text-muted)] mb-3"></i>
            <p className="text-[var(--text-secondary)]">Complaint not found</p>
            <Link to="/my-reports" className="btn btn-primary mt-3">
              <i className="fas fa-arrow-left me-2"></i>
              Back to My Complaints
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <div className="container" style={{ paddingTop: "100px", paddingBottom: "50px" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>
              <i className="fas fa-file-alt me-2 text-primary"></i>
              Complaint Details
            </h2>
            <p className="text-[var(--text-secondary)] mb-0">
              Comprehensive view of your environmental complaint
            </p>
          </div>
          <Link to="/my-reports" className="btn btn-outline">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Complaints
          </Link>
        </div>

        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            <div className="card mb-4">
              {report.imageUrl && (
                <div className="position-relative">
                  <img
                    src={report.imageUrl}
                    alt="Environmental Issue Evidence"
                    className="card-img-top"
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    {getStatusBadge(report.status)}
                  </div>
                </div>
              )}
              
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h3 className="card-title mb-2">
                      <i className={`${getCategoryIcon(report.category)} me-2 text-primary`}></i>
                      {report.category}
                    </h3>
                    <small className="text-[var(--text-muted)]">
                      <i className="fas fa-calendar me-1"></i>
                      Reported on {new Date(report.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                  </div>
                  {!report.imageUrl && (
                    <div>
                      {getStatusBadge(report.status)}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h5 className="text-[var(--text-primary)] mb-2">
                    <i className="fas fa-file-alt me-1"></i>
                    Issue Description
                  </h5>
                  <p className="text-[var(--text-secondary)]">
                    {report.description || "No description provided"}
                  </p>
                </div>

                <div className="mb-4">
                  <h5 className="text-[var(--text-primary)] mb-2">
                    <i className="fas fa-map-marker-alt me-1"></i>
                    Location Details
                  </h5>
                  <p className="text-[var(--text-secondary)]">
                    {report.location || "Location not specified"}
                  </p>
                  {report.latitude && report.longitude && (
                    <small className="text-[var(--text-muted)]">
                      Coordinates: {report.latitude}, {report.longitude}
                    </small>
                  )}
                </div>

                {report.remarks && (
                  <div className="mb-4">
                    <h5 className="text-[var(--text-primary)] mb-2">
                      <i className="fas fa-comment me-1"></i>
                      Authority Remarks
                    </h5>
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      {report.remarks}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Status Card */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Complaint Status
                </h5>
              </div>
              <div className="card-body">
                <div className="text-center mb-3">
                  {getStatusBadge(report.status)}
                </div>
                <div className="small text-[var(--text-secondary)]">
                  <p className="mb-2">
                    <i className="fas fa-clock me-1"></i>
                    <strong>Created:</strong> {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mb-2">
                    <i className="fas fa-edit me-1"></i>
                    <strong>Last Updated:</strong> {new Date(report.updatedAt || report.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mb-0">
                    <i className="fas fa-user me-1"></i>
                    <strong>Reported by:</strong> {report.userFullName || report.userName || "Anonymous"}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Details */}
            {report.address && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="fas fa-home me-2"></i>
                    Address Details
                  </h5>
                </div>
                <div className="card-body">
                  <div className="small text-[var(--text-secondary)]">
                    {report.address.doorNo && <p className="mb-1"><strong>Door No:</strong> {report.address.doorNo}</p>}
                    {report.address.street && <p className="mb-1"><strong>Street:</strong> {report.address.street}</p>}
                    {report.address.villageOrTown && <p className="mb-1"><strong>Village/Town:</strong> {report.address.villageOrTown}</p>}
                    {report.address.district && <p className="mb-1"><strong>District:</strong> {report.address.district}</p>}
                    {report.address.state && <p className="mb-1"><strong>State:</strong> {report.address.state}</p>}
                    {report.address.pincode && <p className="mb-0"><strong>Pincode:</strong> {report.address.pincode}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-cogs me-2"></i>
                  Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <Link to="/report" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    Report New Issue
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="btn btn-danger"
                  >
                    {isDeleting ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-trash me-2"></i>
                        Delete Complaint
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReportDetail;
