import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import CustomerPortal from "./pages/portal/CustomerPortal";

import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import HotspotsPage from "./pages/dashboard/HotspotsPage";
import PackagesPage from "./pages/dashboard/PackagesPage";
import SessionsPage from "./pages/dashboard/SessionsPage";
import PaymentsPage from "./pages/dashboard/PaymentsPage";
import DevicesPage from "./pages/dashboard/DevicesPage";
import StaffPage from "./pages/dashboard/StaffPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route index path="/portal/:hotspotId" element={<CustomerPortal />} />

          {/* DASHBOARD ROUTES WITH LAYOUT */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route
              path="hotspots"
              element={
                <RoleProtectedRoute allowedRoles={["admin"]}>
                  <HotspotsPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route
              path="payments"
              element={
                <RoleProtectedRoute allowedRoles={["admin"]}>
                  <PaymentsPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="devices" element={<DevicesPage />} />
            <Route
              path="staff"
              element={
                <RoleProtectedRoute allowedRoles={["admin"]}>
                  <StaffPage />
                </RoleProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
