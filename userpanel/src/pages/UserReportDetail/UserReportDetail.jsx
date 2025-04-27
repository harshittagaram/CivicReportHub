import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar/Navbar";

const UserReportDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem("userName") || "Harshit";

  const fetchReportDetails = async () => {
    try {
      console.log("Fetching user report with ID:", id);
      const response = await axios.get(
        `http://localhost:8081/api/user/complaints/${id}`,
        { params: { userName } }
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

  if (loading) {
    return (
      <div className="container mt-5">
        <h4 className="text-center">Loading report details...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <h4 className="text-danger text-center">{error}</h4>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mt-5">
        <h4 className="text-center">Report not found.</h4>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Report Details</h2>
        <div className="card shadow">
          <img
            src={report.imageUrl || "https://via.placeholder.com/400"}
            alt={report.userName || "Report"}
            className="card-img-top"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h4 className="card-title">{report.category}</h4>
            <p className="card-text">
              <strong>Name:</strong> {report.userName}
            </p>
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
            <p className="card-text">
              <strong>Remarks:</strong> {report.remarks || "No remarks"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReportDetail;
