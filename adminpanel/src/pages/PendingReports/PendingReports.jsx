import React from "react";
import ReportDisplay from "../../components/ReportDisplay/ReportDisplay";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";

const InProgressReports = () => {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div
        className="flex-grow-1"
        style={{ marginLeft: "250px", padding: "20px" }}
      >
        <h2 className="text-center mb-4">Pending Reports</h2>
        <ReportDisplay category="All" searchText="" status="Pending" />
      </div>
    </div>
  );
};

export default InProgressReports;
