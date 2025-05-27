import { Route, Routes } from "react-router-dom";
// import Map from "./components/Map";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { ReportProvider } from "./components/ReportContext/ReportContext"
import AdminHome from "./pages/AdminHome/AdminHome";
import ReportList from "./pages/ReportList/ReportList";
import ResolvedReports from "./pages/ResolvedReports/ResolvedReports";
import ReportDetail from "./pages/ReportDetail/ReportDetail";
import PendingReports from "./pages/PendingReports/PendingReports";
import InProgressReports from "./pages/InProgessReports/InProgressReports";
function App() {
  return (
    <ReportProvider>
      <div>
        <ToastContainer position="top-right" autoClose={3000} />
        {/* <Map /> */}
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/reports" element={<ReportList />} />
          <Route path="/resolved-reports" element={<ResolvedReports />} />
          <Route path="/admin/report/:id" element={<ReportDetail />} />{" "}
          <Route path="/in-progress-reports" element={<InProgressReports />} />
          <Route path="/resolved-reports" element={<ResolvedReports />} />
          <Route path="/pending-reports" element={<PendingReports />} />
        </Routes>
      </div>
    </ReportProvider>
  );
}

export default App;
