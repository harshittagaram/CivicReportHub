import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import FeatureCards from "../../components/FeatureCards/FeatureCards";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />
      <Hero />
      <FeatureCards />

      {/* <footer className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-10 mt-16 rounded-t-2xl shadow-lg">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <i className="fas fa-shield-alt text-accent"></i>
              EcoAware Portal
            </h3>
            <p>
              Empowering citizens to actively participate in environmental
              protection. Report issues, track progress, and contribute to a
              cleaner, greener community.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/report"
                  className="hover:text-accent transition inline-flex items-center gap-2"
                >
                  <i className="fas fa-exclamation-triangle text-accent"></i>
                  Report Environmental Issue
                </Link>
              </li>
              <li>
                <Link
                  to="/my-reports"
                  className="hover:text-accent transition inline-flex items-center gap-2"
                >
                  <i className="fas fa-list-alt text-accent"></i>
                  Track My Complaints
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-accent transition inline-flex items-center gap-2"
                >
                  <i className="fas fa-info-circle text-accent"></i>
                  About the Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-accent transition inline-flex items-center gap-2"
                >
                  <i className="fas fa-phone text-accent"></i>
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-white/80">
          © 2025 EcoAware Portal. An Initiative by Tagaram Harshit.
        </div>
      </footer> */}
    </div>
  );
};

export default Home;
