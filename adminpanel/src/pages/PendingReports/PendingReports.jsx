import React, { useContext } from "react";
import ReportDisplay from "../../components/ReportDisplay/ReportDisplay";
import { ReportContext } from "../../components/ReportContext/ReportContext";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";

const PendingReports = () => {
  const { sortOrder, setSortOrder, refreshReports } = useContext(ReportContext);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    refreshReports({ status: "Pending" });
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        <h2>Pending Reports</h2>
        <div className="mb-3">
          <label className="form-label me-2">Sort by Date:</label>
          <select
            className="form-select w-auto d-inline-block"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="desc">Latest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
        <ReportDisplay category="All" searchText="" status="Pending" />
      </div>
    </div>
  );
};

export default PendingReports;
