import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../../components/Navbar/Navbar";
import { reverseGeocode } from "../../services/locationService";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReportNow = () => {
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState({
    doorNo: "",
    street: "",
    villageOrTown: "",
    district: "",
    state: "",
    pincode: "",
  });

  const userName = "Anonymous User"; // Replace with actual user name if needed
  const { register, handleSubmit, reset } = useForm();
  const token = localStorage.getItem("token");

  // Detect location using browser geolocation API
  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setLatitude(lat.toString());
          setLongitude(lon.toString());

          try {
            const geocodeData = await reverseGeocode(lat, lon);
            if (geocodeData && geocodeData.address) {
              setLocation(
                geocodeData.display_name || `Lat: ${lat}, Lon: ${lon}`
              );
              setAddress({
                doorNo: "",
                street: "",
                villageOrTown:
                  geocodeData.address.village || geocodeData.address.town || "",
                district: geocodeData.address.district || "",
                state: geocodeData.address.state || "",
                pincode: geocodeData.address.postcode || "",
              });
            } else {
              setLocation(`Lat: ${lat}, Lon: ${lon}`);
              setAddress({
                doorNo: "",
                street: "",
                villageOrTown: "",
                district: "",
                state: "",
                pincode: "",
              });
            }
          } catch (error) {
            console.error("Error in reverseGeocode:", error);
            toast.error("Failed to fetch address. Enter manually.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Location detection failed! Enter manually.");
        }
      );
    } else {
      toast.error("Geolocation not supported in your browser.");
    }
  };

  // Handle address input manually
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("location", location);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("address[doorNo]", address.doorNo);
    formData.append("address[street]", address.street);
    formData.append("address[villageOrTown]", address.villageOrTown);
    formData.append("address[district]", address.district);
    formData.append("address[state]", address.state);
    formData.append("address[pincode]", address.pincode);

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
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Backend response:", response.data);
      toast.success("Complaint submitted successfully!");

      // Reset form and state
      reset();
      setLocation("");
      setLatitude("");
      setLongitude("");
      setAddress({
        doorNo: "",
        street: "",
        villageOrTown: "",
        district: "",
        state: "",
        pincode: "",
      });
    } catch (error) {
      console.error(
        "Error submitting complaint:",
        error.response?.data || error
      );
      toast.error("Failed to submit complaint. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Report an Issue</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Describe the issue in detail"
                {...register("description", { required: true })}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  value={location}
                  readOnly
                  placeholder="Your location will appear here"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleLocationDetection}
                >
                  Detect Location
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Address Details</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "doorNo", placeholder: "Door No" },
                  { name: "street", placeholder: "Street" },
                  { name: "villageOrTown", placeholder: "Village/Town" },
                  { name: "district", placeholder: "District" },
                  { name: "state", placeholder: "State" },
                  { name: "pincode", placeholder: "Pincode" },
                ].map((field) => (
                  <div key={field.name}>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      name={field.name}
                      placeholder={field.placeholder}
                      value={address[field.name]}
                      onChange={handleAddressChange}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
              <input
                type="file"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                {...register("image")}
                accept="image/*"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportNow;
