import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-light text-center py-5">
      <h1 className="display-5 fw-bold">Make Your City Cleaner</h1>
      <p className="lead">
        Report environmental issues in seconds and help create a cleaner,
        greener tomorrow.
      </p>
      <Link to="/report" className="btn btn-success btn-lg">
        Report an Issue
      </Link>
    </div>
  );
};

export default Hero;
