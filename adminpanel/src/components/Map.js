import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";
<LoadScript
  googleMapsApiKey="AIzaSyBtAubRGSlTZanGLTPT3JrKWsRCFAXZzrE"
  libraries={libraries}
  onLoad={() => {
    console.log("Google Maps script loaded");
    setIsGoogleLoaded(true);
  }}
  onError={handleLoadScriptError}
></LoadScript>;
