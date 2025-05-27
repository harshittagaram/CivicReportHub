import React from "react";
import { Link } from "react-router-dom";

const FeatureCards = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-5">How You Can Help</h2>
      <div className="row text-center">
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="card feature-card shadow-sm">
            <div className="card-body">
              <img
                src="https://img.icons8.com/color/48/000000/report-card.png"
                alt="Report Icon"
              />
              <h5 className="card-title">Report an Issue</h5>
              <p className="card-text">
                Quickly report garbage, pollution, or hazards with ease.
              </p>
              <Link to="/report" className="btn btn-primary">
                Report Now
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="card feature-card shadow-sm">
            <div className="card-body">
              <img
                src="https://img.icons8.com/color/48/000000/checklist.png"
                alt="Reports Icon"
              />
              <h5 className="card-title">My Reports</h5>
              <p className="card-text">
                Track the status of your reported issues effortlessly.
              </p>
              <Link to="/my-reports" className="btn btn-primary">
                View Reports
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="card feature-card shadow-sm">
            <div className="card-body">
              <img
                src="https://img.icons8.com/color/48/000000/light.png"
                alt="Awareness Icon"
              />
              <h5 className="card-title">Awareness</h5>
              <p className="card-text">
                Learn how your actions contribute to a cleaner society.
              </p>
              <Link
                to="https://www.indiatimes.com/trending/environment/21-inspiring-stories-from-across-the-world-that-show-how-we-can-fight-plastic-pollution-371876.html"
                target="_blank"
                className="btn btn-primary"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
