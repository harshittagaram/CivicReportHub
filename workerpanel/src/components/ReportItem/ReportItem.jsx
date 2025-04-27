import React, { useState } from "react";
import { Link } from "react-router-dom";

const ReportItem = ({
  id,
  userName,
  description,
  imageUrl,
  location,
  category,
  status,
}) => {
  const [showId, setShowId] = useState(false);

  

  if (!id) {
    console.warn("ReportItem received invalid ID:", id);
  }

  return (
    <div
      className="col-md-4 mb-4"
      onMouseEnter={() => setShowId(true)}
      onMouseLeave={() => setShowId(false)}
    >
      <Link
        to={`/admin/report/${id || ""}`}
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm">
          <img
            src={imageUrl || "https://via.placeholder.com/150"}
            className="card-img-top"
            alt={userName || "Report"}
          />
          <div className="card-body">
            <h5 className="card-title">{userName || "Unnamed Report"}</h5>
            <p className="card-text">{description || "No description"}</p>
            <p>
              <strong>Location:</strong> {location || "Unknown"}
            </p>
            <p>
              <strong>Category:</strong> {category || "Uncategorized"}
            </p>
            <p>
              <strong>Status:</strong> {status || "Pending"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ReportItem;
