import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../../components/Navbar/Navbar";
import { reverseGeocode } from "../../services/locationService";
import axios from "axios";
import { toast } from "react-toastify";

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
  const [isLoading, setIsLoading] = useState(false);

  const userName = "Anonymous User";
  const { register, handleSubmit, reset } = useForm();
  const token = localStorage.getItem("token");

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
            if (geocodeData?.address) {
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
            }
          } catch (error) {
            toast.error("Failed to fetch address. Enter manually.");
          }
        },
        () => toast.error("Location detection failed! Enter manually.")
      );
    } else {
      toast.error("Geolocation not supported in your browser.");
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("location", location);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    Object.entries(address).forEach(([key, value]) => {
      formData.append(`address[${key}]`, value);
    });
    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      await axios.post("http://localhost:8081/api/user/complaints", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Environmental issue reported successfully!");
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
    } catch {
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-24">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-800 flex items-center">
            <i className="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
            Report Environmental Issue
          </h2>
          <p className="mb-6 text-gray-600">
            Help us maintain a clean and healthy environment by reporting
            environmental concerns.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Description
              </label>
              <textarea
                {...register("description", { required: true })}
                rows={4}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Describe the environmental issue..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Category
              </label>
              <select
                {...register("category", { required: true })}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">Select issue type</option>
                <option value="Garbage">Garbage</option>
                <option value="Drainage">Drainage</option>
                <option value="WaterPollution">Water Pollution</option>
                <option value="AirPollution">Air Pollution</option>
                <option value="Road Damage">Road Damage</option>
                <option value="Deforestation">Deforestation</option>
                <option value="Noise Pollution">Noise Pollution</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Information
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2"
                  value={location}
                  readOnly
                  placeholder="Detected location will appear here"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleLocationDetection}
                >
                  <i className="fas fa-crosshairs mr-1"></i>
                  Detect
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Address
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "doorNo", placeholder: "Door No" },
                  { name: "street", placeholder: "Street" },
                  { name: "villageOrTown", placeholder: "Village/Town" },
                  { name: "district", placeholder: "District" },
                  { name: "state", placeholder: "State" },
                  { name: "pincode", placeholder: "Pincode" },
                ].map(({ name, placeholder }) => (
                  <input
                    key={name}
                    name={name}
                    value={address[name]}
                    onChange={handleAddressChange}
                    placeholder={placeholder}
                    className="w-full border border-gray-300 rounded p-2"
                    type="text"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Supported formats: JPG, PNG. Max size: 5MB
              </p>
            </div>

            <div className="bg-blue-50 text-blue-700 p-3 rounded text-sm">
              <strong>Note:</strong> You can track your complaint in "My
              Complaints".
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>Submit Report
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportNow;
