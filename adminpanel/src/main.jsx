import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css"; // Added for icons
import { ReportProvider } from "./components/ReportContext/ReportContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReportProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReportProvider>
);
