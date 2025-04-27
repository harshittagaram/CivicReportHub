import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [reportList, setReportList] = useState([]);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/admin/complaints"
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
  }, []);

  const refreshReports = () => {
    fetchReports();
  };

  return (
    <ReportContext.Provider value={{ reportList, refreshReports, error }}>
      {children}
    </ReportContext.Provider>
  );
};
