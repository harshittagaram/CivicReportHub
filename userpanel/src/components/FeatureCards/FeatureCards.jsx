import React from "react";
import { Link } from "react-router-dom";

const FeatureCards = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-wide drop-shadow">
            Our Services
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Comprehensive environmental complaint management system for citizens
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-transform duration-200 hover:-translate-y-1">
            <i className="fas fa-exclamation-triangle text-4xl text-primary mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Report Environmental Issues
            </h3>
            <p className="text-gray-600 mb-6">
              Report garbage accumulation, water pollution, air pollution,
              drainage issues, and road damage with detailed location tracking
              and photo evidence.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center justify-center px-5 py-2.5 font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow focus:ring-2 focus:ring-primary"
            >
              Report Issue
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-transform duration-200 hover:-translate-y-1">
            <i className="fas fa-list-alt text-4xl text-primary mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Track Complaint Status
            </h3>
            <p className="text-gray-600 mb-6">
              Monitor the progress of your reported issues in real-time. Get
              updates on resolution status, assigned authorities, and completion
              timelines.
            </p>
            <Link
              to="/my-reports"
              className="inline-flex items-center justify-center px-5 py-2.5 font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow focus:ring-2 focus:ring-primary"
            >
              View My Complaints
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-transform duration-200 hover:-translate-y-1">
            <i className="fas fa-headset text-4xl text-primary mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              24/7 Support
            </h3>
            <p className="text-gray-600 mb-6">
              Get assistance anytime with our dedicated support team. Contact
              through helpline, email, or live chat for immediate help.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow focus:ring-2 focus:ring-primary"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
