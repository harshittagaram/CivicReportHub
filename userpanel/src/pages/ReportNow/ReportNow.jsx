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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
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
      toast.success("Environmental issue reported successfully! Your complaint has been registered.");

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
      toast.error("Failed to submit complaint. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <div className="container" style={{ paddingTop: "100px", paddingBottom: "50px" }}>
        <div className="form-container">
          <div className="form-header">
            <i className="fas fa-exclamation-triangle fa-3x text-primary mb-3"></i>
            <h2>Report Environmental Issue</h2>
            <p>Help us maintain a clean and healthy environment by reporting environmental concerns</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                <i className="fas fa-file-alt me-1"></i>
                Issue Description
              </label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Please describe the environmental issue in detail. Include specific observations, severity, and any immediate concerns."
                {...register("description", { required: true })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                <i className="fas fa-tags me-1"></i>
                Issue Category
              </label>
              <select
                className="form-control form-select"
                {...register("category", { required: true })}
              >
                <option value="">Select the type of environmental issue</option>
                <option value="Garbage">Garbage Accumulation</option>
                <option value="Drainage">Drainage Issues</option>
                <option value="WaterPollution">Water Pollution</option>
                <option value="AirPollution">Air Pollution</option>
                <option value="Road Damage">Road Damage</option>
                <option value="Deforestation">Deforestation</option>
                <option value="Noise Pollution">Noise Pollution</option>
                <option value="Other">Other Environmental Issue</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-map-marker-alt me-1"></i>
                Location Information
              </label>
              <div className="row">
                <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    value={location}
                    readOnly
                    placeholder="Location coordinates will appear here after detection"
                  />
                </div>
                <div className="col-md-4">
                  <button
                    type="button"
                    className="btn btn-secondary w-100"
                    onClick={handleLocationDetection}
                  >
                    <i className="fas fa-crosshairs me-2"></i>
                    Detect Location
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-home me-1"></i>
                Detailed Address
              </label>
              <div className="row">
                {[
                  { name: "doorNo", placeholder: "Door/Flat Number", col: "col-md-3" },
                  { name: "street", placeholder: "Street Name", col: "col-md-9" },
                  { name: "villageOrTown", placeholder: "Village/Town/City", col: "col-md-6" },
                  { name: "district", placeholder: "District", col: "col-md-6" },
                  { name: "state", placeholder: "State", col: "col-md-6" },
                  { name: "pincode", placeholder: "Pincode", col: "col-md-6" },
                ].map((field) => (
                  <div key={field.name} className={field.col}>
                    <input
                      type="text"
                      className="form-control"
                      name={field.name}
                      placeholder={field.placeholder}
                      value={address[field.name]}
                      onChange={handleAddressChange}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-camera me-1"></i>
                Upload Evidence (Optional)
              </label>
              <input
                type="file"
                className="form-control"
                {...register("image")}
                accept="image/*"
                placeholder="Upload photos or images of the issue"
              />
              <small className="text-muted">
                Supported formats: JPG, PNG, GIF. Maximum size: 5MB
              </small>
            </div>

            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Important:</strong> Your report will be reviewed by local authorities. 
              You can track the status of your complaint in the "My Complaints" section.
            </div>

            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane me-2"></i>
                    Submit Environmental Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportNow;
