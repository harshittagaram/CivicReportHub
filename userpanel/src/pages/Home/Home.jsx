import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import FeatureCards from "../../components/FeatureCards/FeatureCards";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <Hero />
      <FeatureCards />
      
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h3>
                <i className="fas fa-shield-alt me-2"></i>
                EcoAware Portal
              </h3>
              <p>
                Empowering citizens to actively participate in environmental protection. 
                Report issues, track progress, and contribute to a cleaner, greener community.
              </p>
              {/* <div className="mt-3">
                <i className="fas fa-phone me-2"></i>
                <span>Helpline: 1800-123-4567</span>
              </div>
              <div className="mt-2">
                <i className="fas fa-envelope me-2"></i>
                <span>support@ecoaware.gov.in</span>
              </div> */}
            </div>
            
            <div className="col-md-4 mb-4">
              <h3>Quick Services</h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/report">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Report Environmental Issue
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/my-reports">
                    <i className="fas fa-list-alt me-2"></i>
                    Track My Complaints
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/about">
                    <i className="fas fa-info-circle me-2"></i>
                    About the Portal
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/contact">
                    <i className="fas fa-phone me-2"></i>
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* <div className="col-md-4 mb-4">
              <h3>Important Links</h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-file-alt me-2"></i>
                    Privacy Policy
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-gavel me-2"></i>
                    Terms of Service
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-question-circle me-2"></i>
                    FAQ
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-download me-2"></i>
                    Download App
                  </a>
                </li>
              </ul>
            </div> */}
          </div>
          
          <div className="footer-bottom">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="mb-0">
                  © 2025 EcoAware Portal. An Initiative by Tagaram Harshit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
