import React from 'react'
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import FeatureCards from '../../components/FeatureCards/FeatureCards';


const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeatureCards />
    </div>
  );
}

export default Home
