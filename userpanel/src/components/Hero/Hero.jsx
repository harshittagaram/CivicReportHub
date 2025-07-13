import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 opacity-10 z-0 bg-[url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><defs><pattern id=%22grid%22 width=%2210%22 height=%2210%22 patternUnits=%22userSpaceOnUse%22><path d=%22M 10 0 L 0 0 0 10%22 fill=%22none%22 stroke=%22rgba(0,0,0,0.1)%22 stroke-width=%220.5%22/></pattern></defs><rect width=%22100%22 height=%22100%22 fill=%22url(%23grid)%22/></svg>')]"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center rounded-xl shadow-lg bg-white border border-gray-200">
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-sm tracking-wide text-primary">
          EcoAware Citizen Portal
        </h1>
        <p className="text-lg mb-8 text-gray-700 leading-relaxed max-w-2xl mx-auto">
          Join the movement for a cleaner, greener environment. Report
          environmental issues, track complaint resolution, and contribute to
          building sustainable communities. Your voice matters in protecting our
          environment.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/report"
            className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow focus:ring-2 focus:ring-primary"
          >
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Report Environmental Issue
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition focus:ring-2 focus:ring-blue-300"
          >
            <i className="fas fa-user-plus mr-2"></i>
            Register as Citizen
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
