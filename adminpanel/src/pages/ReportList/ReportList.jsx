import React, { useState } from "react";
import ReportDisplay from "../../components/ReportDisplay/ReportDisplay";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";

const ReportList = () => {
  const [category, setCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div
        className="flex-grow-1"
        style={{ marginLeft: "250px", padding: "20px" }}
      >
        <h2 className="text-center mb-4">Report List</h2>

        {/* Filter & Search */}
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="input-group mb-3">
                <select
                  className="form-select"
                  style={{ maxWidth: "200px" }}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Garbage">Garbage</option>
                  <option value="Drainage">Drainage</option>
                  <option value="WaterPollution">Water Pollution</option>
                  <option value="AirPollution">Air Pollution</option>
                  <option value="Road Damage">Road Damage</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search reports..."
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                />
                <button className="btn btn-primary" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Reports */}
        <ReportDisplay category={category} searchText={searchText} />
      </div>
    </div>
  );
};

export default ReportList;
