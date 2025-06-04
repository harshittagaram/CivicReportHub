import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import {
  FaMapMarkerAlt,
  FaBolt,
  FaClock,
  FaCar,
  FaMotorcycle,
} from "react-icons/fa";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
};

const libraries = ["places"]; // if you're using autocomplete or other services

const MapLayout = () => {
  const [mapView, setMapView] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [markerIcons, setMarkerIcons] = useState(null);
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Dummy markers
  useEffect(() => {
    const mockStations = [
      {
        id: 1,
        name: "Station A",
        position: { lat: 16.5701, lng: 80.3599 },
        status: "active",
        location: "Town Center",
        fourWheelerSlots: 5,
        twoWheelerSlots: 10,
      },
      {
        id: 2,
        name: "Station B",
        position: { lat: 16.573, lng: 80.361 },
        status: "inactive",
        location: "Main Street",
        fourWheelerSlots: 2,
        twoWheelerSlots: 6,
      },
    ];
    setStations(mockStations);
    setFilteredStations(mockStations);
  }, []);

  const handleMapLoad = (map) => {
    console.log("Map loaded:", map);
    setIsMapInitialized(true);
    setMapLoading(false);

    // Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userPos);
        setMapCenter(userPos);
      },
      (error) => {
        console.error("Error fetching location:", error);
        setLocationError("Could not get user location.");
      }
    );

    // Marker icons
    setMarkerIcons({
      user: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      },
      active: {
        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
      },
      inactive: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      },
    });
  };

  const handleLoadScriptError = (error) => {
    console.error("Google Maps script load error:", error);
    setMapError("Failed to load Google Maps.");
  };

  const handleBookNow = (station) => {
    alert(`Booking started for ${station.name}`);
  };

  return (
    <div>
      {mapView ? (
        <div className="h-[500px] rounded-lg overflow-hidden relative">
          {mapLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading map...</p>
                <p className="mt-1 text-sm text-gray-500">
                  Getting your location...
                </p>
              </div>
            </div>
          )}
          <LoadScript
            googleMapsApiKey="AIzaSyBtAubRGSlTZanGLTPT3JrKWsRCFAXZzrE"
            libraries={libraries}
            onLoad={() => setIsGoogleLoaded(true)}
            onError={handleLoadScriptError}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              options={{
                ...mapOptions,
                center: mapCenter || { lat: 16.57011, lng: 80.35992 },
                zoom: 13,
              }}
              onLoad={handleMapLoad}
            >
              {isMapInitialized && markerIcons && userLocation && (
                <Marker
                  position={userLocation}
                  icon={markerIcons.user}
                  title="Your Location"
                />
              )}

              {isMapInitialized &&
                markerIcons &&
                stations.map((station) => (
                  <Marker
                    key={station.id}
                    position={station.position}
                    icon={
                      station.status === "active"
                        ? markerIcons.active
                        : markerIcons.inactive
                    }
                    onClick={() => setSelectedStation(station)}
                    title={station.name}
                  />
                ))}

              {isMapInitialized && selectedStation && (
                <InfoWindow
                  position={selectedStation.position}
                  onCloseClick={() => setSelectedStation(null)}
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">
                      {selectedStation.name}
                    </h3>
                    <p>{selectedStation.location}</p>
                    <p>Status: {selectedStation.status}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>

          {mapError && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
              <p className="text-sm">{mapError}</p>
            </div>
          )}

          {locationError && (
            <div className="absolute bottom-4 left-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded z-50">
              <p className="text-sm">{locationError}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <div
              key={station.id}
              className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-red-500 text-xl" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {station.name}
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {station.location}
                  </span>
                  <span
                    className={`mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                      station.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {station.status === "active" ? "Open" : "Closed"}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaBolt className="text-yellow-500" />
                  <span>
                    {station.fourWheelerSlots + station.twoWheelerSlots} slots
                    available
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaClock className="text-blue-500" />
                  <span>Open 24/7</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaCar className="text-green-500" />
                  <span>4-wheeler: {station.fourWheelerSlots} slots</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaMotorcycle className="text-purple-500" />
                  <span>2-wheeler: {station.twoWheelerSlots} slots</span>
                </div>
              </div>

              <button
                onClick={() => handleBookNow(station)}
                className={`w-full mt-4 px-4 py-2 rounded-lg transition-colors ${
                  station.status === "active"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={station.status !== "active"}
              >
                {station.status === "active" ? "Book Now" : "Station Closed"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapLayout;
