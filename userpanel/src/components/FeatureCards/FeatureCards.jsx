import React from "react";
import { Link } from "react-router-dom";

const FeatureCards = () => {
  return (
    <div className="features-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2>Our Services</h2>
          <p className="text-[var(--text-secondary)]">
            Comprehensive environmental complaint management system for citizens
          </p>
        </div>
        
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="feature-card">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Report Environmental Issues</h3>
              <p>
                Report garbage accumulation, water pollution, air pollution, drainage issues, 
                and road damage with detailed location tracking and photo evidence.
              </p>
              <Link to="/report" className="btn btn-primary">
                <i className="me-2"></i>
                Report Issue
              </Link>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="feature-card">
              <i className="fas fa-list-alt"></i>
              <h3>Track Complaint Status</h3>
              <p>
                Monitor the progress of your reported issues in real-time. Get updates on 
                resolution status, assigned authorities, and completion timelines.
              </p>
              <Link to="/my-reports" className="btn btn-primary">
                <i className="me-2"></i>
                View My Complaints
              </Link>
            </div>
          </div>
          
          {/* <div className="col-lg-4 col-md-6 mb-4">
            <div className="feature-card">
              <i className="fas fa-chart-line"></i>
              <h3>Community Impact</h3>
              <p>
                See how your reports contribute to community improvement. View statistics 
                and success stories from resolved environmental issues.
              </p>
              <Link to="/about" className="btn btn-primary">
                <i className="fas fa-info-circle me-2"></i>
                Learn More
              </Link>
            </div>
          </div> */}
          
          {/* <div className="col-lg-4 col-md-6 mb-4">
            <div className="feature-card">
              <i className="fas fa-mobile-alt"></i>
              <h3>Mobile Accessibility</h3>
              <p>
                Access the portal from any device. Report issues on-the-go with GPS 
                location detection and instant photo upload capabilities.
              </p>
              <a href="#" className="btn btn-primary">
                <i className="fas fa-download me-2"></i>
                Download App
              </a>
            </div>
          </div> */}
          
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="feature-card">
              <i className="fas fa-headset"></i>
              <h3>24/7 Support</h3>
              <p>
                Get assistance anytime with our dedicated support team. Contact through 
                helpline, email, or live chat for immediate help.
              </p>
              <Link to="/contact" className="btn btn-primary">
                <i className="me-2"></i>
                Contact Support
              </Link>
            </div>
          </div>
          
          {/* <div className="col-lg-4 col-md-6 mb-4">
            <div className="feature-card">
              <i className="fas fa-award"></i>
              <h3>Recognition Program</h3>
              <p>
                Earn recognition for your environmental contributions. Top reporters 
                receive certificates and special acknowledgments from local authorities.
              </p>
              <a href="#" className="btn btn-primary">
                <i className="fas fa-trophy me-2"></i>
                View Achievements
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
