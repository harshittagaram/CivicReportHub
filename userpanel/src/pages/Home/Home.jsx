import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import FeatureCards from "../../components/FeatureCards/FeatureCards";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeatureCards />
      <footer className="footer text-center">
        <div className="container">
          <p>&copy; 2025 CleanCity. All rights reserved.</p>
          <p>
            <Link to="/about">About</Link> | <Link to="/contact">Contact</Link>{" "}
            | <Link to="/privacy">Privacy Policy</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
