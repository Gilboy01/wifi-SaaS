import {
  LayoutDashboard,
  Wifi,
  Package,
  Users,
  CreditCard,
  Laptop,
  Activity,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard />,
      roles: ["admin", "staff"],
    },

    {
      name: "Hotspots",
      path: "/dashboard/hotspots",
      icon: <Wifi />,
      roles: ["admin"],
    },

    {
      name: "Packages",
      path: "/dashboard/packages",
      icon: <Package />,
      roles: ["admin", "staff"],
    },

    {
      name: "Sessions",
      path: "/dashboard/sessions",
      icon: <Activity />,
      roles: ["admin", "staff"],
    },

    {
      name: "Payments",
      path: "/dashboard/payments",
      icon: <CreditCard />,
      roles: ["admin"],
    },

    {
      name: "Devices",
      path: "/dashboard/devices",
      icon: <Laptop />,
      roles: ["admin", "staff"],
    },

    {
      name: "Staff",
      path: "/dashboard/staff",
      icon: <Users />,
      roles: ["admin"],
    },
  ];

  return (
    <div
      className="
      w-64
      bg-black
      text-white
      min-h-screen
      p-4
    "
    >
      <h1
        className="
        text-2xl
        font-bold
        mb-8
      "
      >
        WiFi control
      </h1>

      <div className="space-y-2">
        {links
          .filter((link) => link.roles.includes(user?.role))
          .map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`
                flex
                items-center
                gap-3
                p-3
                rounded-lg
                transition

                ${
                  location.pathname === link.path
                    ? "bg-gray-800"
                    : "hover:bg-gray-600"
                }
              `}
            >
              {link.icon}

              <span>{link.name}</span>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
