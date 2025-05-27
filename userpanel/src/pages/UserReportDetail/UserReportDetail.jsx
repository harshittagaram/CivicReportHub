import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    if (!window.confirm("Are you sure you want to delete this complaint?"))
      return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8081/api/user/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Complaint deleted successfully!");
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

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading report details...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger">{error}</h4>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mt-5 text-center">
        <h4>Report not found.</h4>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4">Complaint Details</h2>
        <div className="card shadow feature-card">
          <img
            src={report.imageUrl || "https://via.placeholder.com/400"}
            alt={report.userFullName || report.userName || "Complaint"}
            className="card-img-top"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h4 className="card-title">{report.category}</h4>
            <p className="card-text">
              <strong>Reported by:</strong>{" "}
              {report.userFullName || report.userName || "Unnamed"}
            </p>
            <p className="card-text">
              <strong>Description:</strong>{" "}
              {report.description || "No description"}
            </p>
            <p className="card-text">
              <strong>Location:</strong> {report.location || "Unknown"}
            </p>
            <p className="card-text">
              <strong>Date:</strong>{" "}
              {new Date(report.createdAt).toLocaleDateString()}
            </p>
            <p className="card-text">
              <strong>Status:</strong>{" "}
              <span
                className={`badge ${
                  report.status === "Pending"
                    ? "bg-secondary"
                    : report.status === "In Progress"
                    ? "bg-warning text-dark"
                    : "bg-success"
                }`}
              >
                {report.status}
              </span>
            </p>
            <p className="card-text">
              <strong>Remarks:</strong> {report.remarks || "No remarks"}
            </p>
            <button
              className="btn btn-danger mt-3"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Complaint"}
            </button>
          </div>
        </div>
      </div>
      <footer className="footer text-center">
        <div className="container">
          <p>&copy; 2025 CleanCity. All rights reserved.</p>
          <p>
            <Link to="/about">About</Link> | <Link to="/contact">Contact</Link>{" "}
            | <Link to="/privacy">Privacy Policy</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserReportDetail;
