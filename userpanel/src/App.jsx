import { useState } from 'react'
import "./App.css";
import Home from './pages/Home/Home';
import { Route, Routes } from "react-router-dom";
import ReportNow from './pages/ReportNow/ReportNow';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import MyReports from './pages/MyReports/MyReports';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/report" element={<ReportNow />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-reports" element={<MyReports />} />

        {/* <Route path="/contact" element={<Contact />} />
        <Route path="/explore" element={<ExploreFood />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />}></Route> */}
      </Routes>
    </div>
  );
}

export default App
