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
      console.log("ReportContext API Response:", response.data);
      if (!Array.isArray(response.data)) {
        throw new Error("Expected an array of reports");
      }
      setReportList(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching reports:", error.response || error);
      setError("Failed to load reports.");
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
