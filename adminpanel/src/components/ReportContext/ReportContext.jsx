import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [reportList, setReportList] = useState([]);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // Default: latest first

  const fetchReports = async (filters = {}) => {
    try {
      const { status, category, location, sort = sortOrder } = filters;
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8081/api/admin/complaints",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { status, category, location, sort },
        }
      );
      if (!Array.isArray(response.data)) {
        throw new Error(
          "Expected an array of reports, but got: " + typeof response.data
        );
      }
      setReportList(response.data);
      setError(null);
    } catch (error) {
      console.error(
        "Error fetching reports:",
        error.response ? error.response.data : error.message
      );
      setError("Failed to load reports. Check console for details.");
      setReportList([]);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [sortOrder]);

  const refreshReports = (filters = {}) => {
    fetchReports(filters);
  };

  return (
    <ReportContext.Provider
      value={{ reportList, refreshReports, error, sortOrder, setSortOrder }}
    >
      {children}
    </ReportContext.Provider>
  );
};
