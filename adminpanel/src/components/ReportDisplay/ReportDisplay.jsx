import React, { useContext } from "react";
import { ReportContext } from "../ReportContext/ReportContext";
import ReportItem from "../ReportItem/ReportItem";

const ReportDisplay = ({ category, searchText, status }) => {
  const { reportList, error } = useContext(ReportContext);
  const filteredReports = reportList.filter((report) => {
    if (!report || !report.id) {
      console.warn("Invalid report:", report);
      return false;
    }

    const matchesCategory = category === "All" || report.category === category;
    const matchesStatus = !status || report.status === status;
    const matchesSearch = (report.userName || "")
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  if (error) {
    return (
      <div className="text-center mt-4">
        <h4 className="text-danger">{error}</h4>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <ReportItem
              key={report.id}
              id={report.id}
              userName={report.userName}
              description={report.description}
              imageUrl={report.imageUrl}
              location={report.location}
              category={report.category}
              status={report.status}
            />
          ))
        ) : (
          <div className="text-center mt-4">
            <h4>No reports found.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDisplay;
