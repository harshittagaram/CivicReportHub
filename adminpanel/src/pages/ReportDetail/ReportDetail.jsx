import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import { ReportContext } from "../../components/ReportContext/ReportContext";

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshReports } = useContext(ReportContext);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        console.log("Fetching report with ID:", id);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8081/api/admin/complaints/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(
          "ReportDetail API Response:",
          JSON.stringify(response.data, null, 2)
        ); // Detailed logging
        setReport(response.data);
        setStatus(response.data.status || "Pending");
        setFeedback(response.data.remarks || "");
      } catch (error) {
        console.error(
          "Error fetching report details:",
          error.response?.data || error
        );
        setError("Failed to load report details. Please try again.");
        toast.error("Error fetching report details");
      }
    };

    if (id) fetchReportDetails();
    else {
      console.warn("No ID provided to ReportDetail");
      setError("Invalid report ID.");
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log("Sending update payload:", { status, remarks: feedback });
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8081/api/admin/complaints/${id}`,
        { status, remarks: feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Update API Response:", response.data);
      setReport(response.data);
      if (refreshReports) refreshReports();

      // Custom toast based on status
      if (status === "Resolved") {
        toast.info("Marked as resolved. Awaiting user confirmation.");
      } else if (status === "In Progress") {
        toast.success("Report marked as In Progress.");
      } else if (status === "Pending") {
        toast.success("Report marked as Pending.");
      } else {
        toast.success("Report updated successfully!");
      }
    } catch (error) {
      console.error("Error updating report:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update report. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8081/api/admin/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshReports) refreshReports();
      toast.success("Report deleted successfully!");
      navigate("/reports");
    } catch (error) {
      console.error("Error deleting report:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete report. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusDisplay = () => {
    if (report.status === "Resolved" && report.userAccepted === false) {
      return <span className="badge badge-warning">Awaiting User Confirmation</span>;
    }
    switch (report.status) {
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

  if (error) {
    return (
      <div className="container mt-5">
        <h4 className="text-danger">{error}</h4>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mt-5">
        <h4>Loading report details...</h4>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "250px", backgroundColor: "#f8f9fa" }}>
        <AdminSidebar />
      </div>
      <div className="container mt-4" style={{ flex: 1 }}>
        <div className="card shadow mb-4">
          <img
            src={report.imageUrl || "https://via.placeholder.com/400"}
            alt={report.userFullName || report.userName || "Report"}
            className="card-img-top"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h4 className="card-title">
              Report by:{" "}
              {report.userFullName || report.userName || "Unnamed Report"}
            </h4>
            <p className="card-text">
              {report.description || "No description available"}
            </p>
            <p>
              <strong>Location:</strong> {report.location || "Unknown"}
            </p>
            <p>
              <strong>Coordinates:</strong>{" "}
              {report.latitude != null && report.longitude != null
                ? `Lat: ${report.latitude}, Lon: ${report.longitude}`
                : "Not provided"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {report.address
                ? [
                    report.address.doorNo,
                    report.address.street,
                    report.address.villageOrTown,
                    report.address.district,
                    report.address.state,
                    report.address.pincode,
                  ]
                    .filter((field) => field && field.trim() !== "")
                    .join(", ") || "No address details provided"
                : "No address object provided"}
            </p>
            <p>
              <strong>Category:</strong> {report.category || "Uncategorized"}
            </p>
            <p>
              <strong>Status:</strong> {getStatusDisplay()}
            </p>
            <p>
              <strong>Remarks:</strong> {report.remarks || "No remarks"}
            </p>
            <button
              className="btn btn-danger mt-2"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Report"}
            </button>
          </div>
        </div>
        <div className="card shadow">
          <div className="card-body">
            <h5 className="card-title">Update Report</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="feedback" className="form-label">
                  Feedback/Remarks
                </label>
                <textarea
                  id="feedback"
                  className="form-control"
                  rows="4"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter feedback or remarks"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Update Report"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
