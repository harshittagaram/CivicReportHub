import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../../components/Navbar/Navbar";
import { reverseGeocode } from "../../services/locationService";
import axios from "axios";

const ReportNow = () => {
  const [location, setLocation] = useState("");
  const { register, handleSubmit } = useForm();

  const token = localStorage.getItem("token"); // Get token from localStorage

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const address = await reverseGeocode(lat, lon);
          if (address) {
            setLocation(address);
          } else {
            setLocation(`Lat: ${lat}, Lon: ${lon}`);
          }
        },
        (error) => {
          alert("Location detection failed!");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("userName", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("location", location);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/api/user/complaints",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Add Authorization header here
          },
        }
      );
      console.log("Backend response:", response.data);
      alert("Complaint submitted successfully!");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4">Report an Issue</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 border rounded shadow"
        >
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Your Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              {...register("name", { required: true })}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              rows="4"
              {...register("description", { required: true })}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              className="form-select"
              {...register("category", { required: true })}
            >
              <option value="">Select Category</option>
              <option value="Garbage">Garbage</option>
              <option value="Drainage">Drainage</option>
              <option value="WaterPollution">Water Pollution</option>
              <option value="AirPollution">Air Pollution</option>
              <option value="Road Damage">Road Damage</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              value={location}
              readOnly
            />
            <button
              type="button"
              className="btn btn-info mt-2"
              onClick={handleLocationDetection}
            >
              Detect My Location
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Image (Optional)</label>
            <input
              type="file"
              className="form-control"
              {...register("image")}
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success btn-lg">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportNow;
