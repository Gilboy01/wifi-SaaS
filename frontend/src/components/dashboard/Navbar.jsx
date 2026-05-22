import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };
  return (
    <div
      className="
      fixed
      top-0
      left-0
      right-0
      bg-white
      shadow-sm
      h-16
      px-6
      flex
      items-center
      justify-between
      z-50
    "
    >
      <h2
        className="
        text-xl
        font-semibold
      "
      >
        Admin Dashboard
      </h2>

      <div>
        <button
          onClick={handleLogout}
          className="
          bg-black
          text-white
          px-4
          py-2
          rounded-lg
        "
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
