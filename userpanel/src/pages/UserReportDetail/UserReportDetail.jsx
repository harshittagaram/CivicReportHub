import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading report details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-3 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-3 text-gray-600">Report not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Report Details</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <img
            src={report.imageUrl || "https://via.placeholder.com/400"}
            alt={report.userFullName || report.userName || "Complaint"}
            className="w-full h-64 object-cover"
          />
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{report.category}</h3>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium
                ${report.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : report.status === "In Progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
                }`}
              >
                {report.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Reported by</p>
                  <p className="mt-1">{report.userFullName || report.userName || "Unnamed"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="mt-1">{report.description || "No description"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="mt-1">{report.location || "Unknown"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Date Reported</p>
                  <p className="mt-1">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remarks</p>
                  <p className="mt-1">{report.remarks || "No remarks"}</p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? "Deleting..." : "Delete Report"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600">&copy; 2025 CleanCity. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              <Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserReportDetail;
