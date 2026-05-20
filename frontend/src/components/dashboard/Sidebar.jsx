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

const Sidebar = () => {
  const location = useLocation();

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard/",
      icon: <LayoutDashboard />,
    },

    {
      name: "Hotspots",
      path: "/dashboard/hotspots",
      icon: <Wifi />,
    },

    {
      name: "Packages",
      path: "/dashboard/packages",
      icon: <Package />,
    },

    {
      name: "Sessions",
      path: "/dashboard/sessions",
      icon: <Activity />,
    },

    {
      name: "Payments",
      path: "/dashboard/payments",
      icon: <CreditCard />,
    },

    {
      name: "Devices",
      path: "/dashboard/devices",
      icon: <Laptop />,
    },

    {
      name: "Staff",
      path: "/dashboard/staff",
      icon: <Users />,
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
        {links.map((link) => (
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
                    : "hover:bg-gray-900"
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
