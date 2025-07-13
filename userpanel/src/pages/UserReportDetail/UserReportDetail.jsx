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
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8081/api/user/complaints/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReport(response.data);
      setError(null);
    } catch (error) {
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
    if (
      !window.confirm(
        "Are you sure you want to delete this environmental complaint?"
      )
    )
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
      toast.error("Failed to delete complaint.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAcceptResolution = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8081/api/user/accept-resolution/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Resolution accepted!");
      fetchReportDetails();
    } catch (err) {
      toast.error("Failed to accept resolution.");
    }
  };

  const getStatusBadge = (status, userAccepted) => {
    const base = "inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-sm";
    if (status === "Resolved" && userAccepted === false) {
      return (
        <span className={`${base} bg-yellow-100 text-yellow-800 border border-yellow-300 animate-pulse`}>
          Awaiting Confirmation
        </span>
      );
    }
    switch (status) {
      case "Pending":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-800 border border-yellow-300`}>
            Pending
          </span>
        );
      case "In Progress":
        return (
          <span className={`${base} bg-blue-100 text-blue-800 border border-blue-300`}>
            In Progress
          </span>
        );
      case "Resolved":
        return (
          <span className={`${base} bg-green-100 text-green-800 border border-green-300`}>
            Resolved
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-800 border border-gray-300`}>Unknown</span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-4"></i>
            <p className="text-gray-600">Loading complaint details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-3xl text-red-500 mb-4"></i>
            <p className="text-gray-600">{error || "Complaint not found."}</p>
            <Link
              to="/my-reports"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
            >
              <i className="fas fa-arrow-left mr-2"></i> Back to My Complaints
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
          <div className="md:w-2/3 space-y-6">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              {report.imageUrl && (
                <div className="relative">
                  <img
                    src={report.imageUrl}
                    alt="Issue Evidence"
                    className="w-full h-64 object-cover rounded-t-2xl"
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(report.status, report.userAccepted)}
                  </div>
                </div>
              )}
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-700">
                      <i
                        className={`mr-2 ${
                          report.category && `fas fa-${report.category.toLowerCase()}`
                        }`}
                      ></i>
                      {report.category}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      <i className="fas fa-calendar-alt mr-1"></i>
                      Reported on {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!report.imageUrl && (
                    <div>{getStatusBadge(report.status, report.userAccepted)}</div>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-1">
                    Issue Description
                  </h4>
                  <p className="text-gray-600">
                    {report.description || "No description provided."}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-1">
                    Location
                  </h4>
                  <p className="text-gray-600">
                    {report.location || "Location not specified."}
                  </p>
                  <p className="text-sm text-gray-500">
                    {report.latitude && report.longitude && `Coordinates: ${report.latitude}, ${report.longitude}`}
                  </p>
                </div>

                {report.remarks && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <h4 className="text-blue-700 font-medium mb-1">
                      Authority Remarks
                    </h4>
                    <p className="text-blue-700">{report.remarks}</p>
                  </div>
                )}

                {report.status === "Resolved" && report.userAccepted === false && (
                  <button
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 shadow transition"
                    onClick={handleAcceptResolution}
                  >
                    <i className="fas fa-check-circle mr-2"></i>
                    Accept Resolution
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:w-1/3 space-y-6">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <i className="fas fa-info-circle mr-2"></i> Complaint Status
              </h4>
              <div className="text-center mb-3">
                {getStatusBadge(report.status, report.userAccepted)}
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Created:</strong> {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Updated:</strong> {new Date(report.updatedAt || report.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Reported by:</strong> {report.userFullName || report.userName || "Anonymous"}
                </p>
              </div>
            </div>

            {report.address && (
              <div className="bg-white shadow-lg rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <i className="fas fa-home mr-2"></i> Address Details
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {report.address.doorNo && (
                    <p>
                      <strong>Door No:</strong> {report.address.doorNo}
                    </p>
                  )}
                  {report.address.street && (
                    <p>
                      <strong>Street:</strong> {report.address.street}
                    </p>
                  )}
                  {report.address.villageOrTown && (
                    <p>
                      <strong>Town:</strong> {report.address.villageOrTown}
                    </p>
                  )}
                  {report.address.district && (
                    <p>
                      <strong>District:</strong> {report.address.district}
                    </p>
                  )}
                  {report.address.state && (
                    <p>
                      <strong>State:</strong> {report.address.state}
                    </p>
                  )}
                  {report.address.pincode && (
                    <p>
                      <strong>Pincode:</strong> {report.address.pincode}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <i className="fas fa-cogs mr-2"></i> Actions
              </h4>
              <div className="flex flex-col gap-3">
                <Link
                  to="/report"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg shadow"
                >
                  <i className="fas fa-plus mr-2"></i> Report New Issue
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow"
                >
                  {isDeleting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i> Deleting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash mr-2"></i> Delete Complaint
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReportDetail;
