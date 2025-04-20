import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = "Harshit"; // Replace with dynamic value if available

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/user`, {
        params: { userName },
      })
      .then((res) => {
        setReports(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch reports", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <h2 className="mb-4 text-center">My Reports</h2>

        {loading ? (
          <p className="text-center">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-center">No reports found.</p>
        ) : (
          <div className="row">
            {reports.map((report) => (
              <div className="col-md-6 mb-4" key={report.id}>
                <div className="card shadow-sm h-100">
                  {report.imageUrl && (
                    <img
                      src={report.imageUrl}
                      className="card-img-top"
                      alt="Reported Issue"
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{report.category}</h5>
                    <p className="card-text">
                      <strong>Name:</strong> {report.userName}
                    </p>
                    <p className="card-text">
                      <strong>Description:</strong> {report.description}
                    </p>
                    <p className="card-text">
                      <strong>Location:</strong> {report.location}
                    </p>
                    <p className="card-text">
                      <strong>Date:</strong>{" "}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    <hr />
                    <p className="card-text">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge ${
                          report.status === "Pending"
                            ? "bg-secondary"
                            : report.status === "In Progress"
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                      >
                        {report.status}
                      </span>
                    </p>
                    {report.remarks && (
                      <p className="card-text">
                        <strong>Remarks:</strong> {report.remarks}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
