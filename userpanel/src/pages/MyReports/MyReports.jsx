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
      const response = await axios.get(
        "http://localhost:8081/api/user/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReports(response.data);
      setError(null);
    } catch (err) {
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

  const handleAcceptResolution = async (reportId) => {
    try {
      await axios.put(
        `http://localhost:8081/api/user/accept-resolution/${reportId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Resolution accepted. Thank you for your feedback!");
      fetchReports();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to accept resolution. Please try again."
      );
    }
  };

  const getStatusBadge = (status, userAccepted) => {
    const base = "text-xs font-medium px-2.5 py-0.5 rounded-full";
    if (status === "Resolved" && userAccepted === false)
      return (
        <span className={`${base} bg-yellow-100 text-yellow-800 border border-yellow-300 animate-pulse`}>
          Awaiting Your Confirmation
        </span>
      );
    switch (status) {
      case "Pending":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-800`}>
            Pending
          </span>
        );
      case "In Progress":
        return (
          <span className={`${base} bg-blue-100 text-blue-800`}>
            In Progress
          </span>
        );
      case "Resolved":
        return (
          <span className={`${base} bg-green-100 text-green-800`}>
            Resolved
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-800`}>Unknown</span>
        );
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              <i className="fas fa-list-alt text-blue-600 mr-2"></i>
              My Environmental Complaints
            </h2>
            <p className="text-gray-600">
              Track the status of your reported environmental issues
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isRefreshing || loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Refreshing...
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <i className="fas fa-spinner fa-spin fa-3x text-blue-600 mb-4"></i>
            <p className="text-gray-600">Loading your complaints...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 bg-white rounded shadow">
            <i className="fas fa-inbox fa-4x text-gray-400 mb-4"></i>
            <h4 className="text-xl font-semibold">No Complaints Found</h4>
            <p className="text-gray-500 mb-4">
              You haven't reported any environmental issues yet.
            </p>
            <Link
              to="/report"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <i className="fas fa-plus mr-2"></i> Report Your First Issue
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded shadow overflow-hidden"
              >
                <div className="flex flex-col h-full bg-white rounded-2xl shadow-md overflow-hidden">
                  {report.imageUrl && (
                    <div className="relative">
                      <img
                        src={report.imageUrl}
                        alt="Reported Issue"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(report.status, report.userAccepted)}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col justify-between flex-grow">
                    <div className="p-4">
                      <div className="flex justify-between mb-3">
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-1">
                            <i
                              className={`${getCategoryIcon(
                                report.category
                              )} text-blue-600 mr-2`}
                            ></i>
                            {report.category}
                          </h5>
                          <small className="text-gray-500">
                            <i className="fas fa-calendar mr-1"></i>
                            Reported on{" "}
                            {new Date(report.createdAt).toLocaleDateString(
                              "en-IN"
                            )}
                          </small>
                        </div>
                        {!report.imageUrl &&
                          getStatusBadge(report.status, report.userAccepted)}
                      </div>

                      <div className="mb-3">
                        <h6 className="text-sm font-semibold text-gray-700 mb-1">
                          <i className="fas fa-file-alt mr-1"></i> Issue
                          Description
                        </h6>
                        <p className="text-gray-600 text-sm">
                          {report.description?.length > 100
                            ? `${report.description.substring(0, 100)}...`
                            : report.description}
                        </p>
                      </div>

                      <div className="mb-3">
                        <h6 className="text-sm font-semibold text-gray-700 mb-1">
                          <i className="fas fa-map-marker-alt mr-1"></i>{" "}
                          Location
                        </h6>
                        <p className="text-gray-600 text-sm">
                          {report.location}
                        </p>
                      </div>

                      {report.remarks && (
                        <div className="mb-3">
                          <h6 className="text-sm font-semibold text-gray-700 mb-1">
                            <i className="fas fa-comment mr-1"></i> Authority
                            Remarks
                          </h6>
                          <div className="bg-blue-50 text-blue-800 p-2 rounded text-sm">
                            <i className="fas fa-info-circle mr-2"></i>
                            {report.remarks.length > 80
                              ? `${report.remarks.substring(0, 80)}...`
                              : report.remarks}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sticky Bottom Section */}
                    <div className="px-4 pb-4 mt-auto">
                      {report.status === "Resolved" &&
                        report.userAccepted === false && (
                          <button
                            onClick={() => handleAcceptResolution(report.id)}
                            className="w-full py-2 mb-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            <i className="fas fa-check-circle mr-2"></i>
                            Accept Resolution
                          </button>
                        )}

                      <div className="pt-3 border-t text-sm text-gray-500 flex justify-between">
                        <span>
                          <i className="fas fa-clock mr-1"></i>
                          Last updated:{" "}
                          {new Date(
                            report.updatedAt || report.createdAt
                          ).toLocaleDateString()}
                        </span>
                        <Link
                          to={`/report-detail/${report.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          <i className="fas fa-eye mr-1"></i> View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {reports.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/report"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <i className="fas fa-plus mr-2"></i>
              Report New Issue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
