import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero" style={{ paddingTop: '56px' }}>
      <div className="hero-content">
        <div className="mb-4">
          {/* <i className="fas fa-leaf fa-4x text-[var(--accent)]"></i> */}
        </div>
        <h1>EcoAware Citizen Portal</h1>
        <p>
          Join the movement for a cleaner, greener environment. Report environmental issues, 
          track complaint resolution, and contribute to building sustainable communities. 
          Your voice matters in protecting our environment.
        </p>
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
          <Link to="/report" className="btn btn-primary">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Report Environmental Issue
          </Link>
          <Link to="/register" className="btn btn-outline">
            <i className="fas fa-user-plus me-2"></i>
            Register as Citizen
          </Link>
        </div>
        
        <div className="mt-5">
          <div className="row text-center">
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-center justify-content-center">
                {/* <i className="fas fa-users fa-2x text-[var(--accent)] me-3"></i> */}
                {/* <div className="text-start">
                  <h4 className="mb-0">10,000+</h4>
                  <small>Active Citizens</small>
                </div> */}
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-center justify-content-center">
                {/* <i className="fas fa-check-circle fa-2x text-[var(--success)] me-3"></i>
                <div className="text-start">
                  <h4 className="mb-0">5,000+</h4>
                  <small>Issues Resolved</small>
                </div> */}
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-center justify-content-center">
                {/* <i className="fas fa-city fa-2x text-[var(--info)] me-3"></i>
                <div className="text-start">
                  <h4 className="mb-0">50+</h4>
                  <small>Cities Covered</small>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
