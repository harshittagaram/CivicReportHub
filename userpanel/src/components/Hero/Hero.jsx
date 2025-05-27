import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero">
      <div className="container">
        <h1>Make Your City Cleaner</h1>
        <p>
          Report environmental issues instantly and contribute to a cleaner
          tomorrow.
        </p>
        <Link to="/report" className="btn btn-primary btn-lg">
          Report an Issue
        </Link>
      </div>
    </div>
  );
};

export default Hero;
