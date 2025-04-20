import React from "react";
import { Link } from "react-router-dom";

const FeatureCards = () => {
  return (
    <div className="container my-5">
      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Report an Issue</h5>
              <p className="card-text">
                Easily report garbage dumps, pollution, or other environmental
                hazards with just a few clicks.
              </p>
              <Link to="/report" className="btn btn-outline-success">
                Report Now
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">My Reports</h5>
              <p className="card-text">
                View the status of the issues you have reported and track their
                resolution.
              </p>
              <Link to="/my-reports" className="btn btn-outline-success">
                View Reports
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Awareness</h5>
              <p className="card-text">
                Learn how your actions help build a cleaner society and stay
                updated with tips and news.
              </p>
              <Link
                to="https://www.indiatimes.com/trending/environment/21-inspiring-stories-from-across-the-world-that-show-how-we-can-fight-plastic-pollution-371876.html"
                target="_blank"
                className="btn btn-outline-success"
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
