import axios from "axios";

export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    return response.data.display_name;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
};
