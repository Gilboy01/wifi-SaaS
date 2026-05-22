import Sidebar from "../../components/dashboard/Sidebar";

import Navbar from "../../components/dashboard/Navbar";

import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div
      className="
      flex
      min-h-screen
      bg-gray-100
    "
    >
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6 pt-16">
          <Outlet />
          {/*
          we use outlet because nested routes render here.
          Very important React Router concept.
          */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
