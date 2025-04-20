import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import { ReportContext } from "../../components/ReportContext/ReportContext";

const ReportDetail = () => {
  const { id } = useParams();
  const { refreshReports } = useContext(ReportContext);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        console.log("Fetching report with ID:", id);
        const response = await axios.get(
          `http://localhost:8081/api/admin/complaints/${id}`
        );
        console.log("ReportDetail API Response:", response.data);
        setReport(response.data);
        setStatus(response.data.status || "Pending");
        setFeedback(response.data.remarks || "");
      } catch (error) {
        console.error(
          "Error fetching report details:",
          error.response || error
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
      const response = await axios.put(
        `http://localhost:8081/api/admin/complaints/${id}`,
        {
          status,
          remarks: feedback,
        }
      );
      console.log("Update API Response:", response.data);
      setReport(response.data);
      if (refreshReports) refreshReports();
      toast.success("Report updated successfully!");
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
            alt={report.userName || "Report"}
            className="card-img-top"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h4 className="card-title">
              Report by: {report.userName || "Unnamed Report"}
            </h4>
            <p className="card-text">
              {report.description || "No description available"}
            </p>
            <p>
              <strong>Location:</strong> {report.location || "Unknown"}
            </p>
            <p>
              <strong>Category:</strong> {report.category || "Uncategorized"}
            </p>
            <p>
              <strong>Status:</strong> {report.status || "Pending"}
            </p>
            <p>
              <strong>Remarks:</strong> {report.remarks || "No remarks"}
            </p>
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
