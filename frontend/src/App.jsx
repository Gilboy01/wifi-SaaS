import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import HotspotsPage from "./pages/dashboard/HotspotsPage";
import PackagesPage from "./pages/dashboard/PackagesPage";
import SessionsPage from "./pages/dashboard/SessionsPage";
import PaymentsPage from "./pages/dashboard/PaymentsPage";
import DevicesPage from "./pages/dashboard/DevicesPage";
import StaffPage from "./pages/dashboard/StaffPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />

          {/* DASHBOARD ROUTES WITH LAYOUT */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="hotspots" element={<HotspotsPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="devices" element={<DevicesPage />} />
            <Route path="staff" element={<StaffPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
