import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Wifi, CreditCard, Ticket } from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const CustomerHomePage = () => {
  const { hotspotId } = useParams();
  const [hotspot, setHotspot] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  //   fetch hotspot
  const fetchHotspot = async () => {
    try {
      const res = await api.get(`public/hotspots/${hotspotId}`);
      setHotspot(res.data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Hotspot not found");
    } finally {
      setLoading(false);
    }
  };

  // load on app start
  useEffect(() => {
    fetchHotspot();
  }, []);

  //   handle buy now
  const handleBuy = () => {
    try {
      setLoading(true);
      const macAddress = searchParams.get("mac").toUpperCase();
      navigate("/payment-portal", {
        state: {
          hotspot,
          hotspotId,
          macAddress,
        },
      });
    } catch {
      toast.error("Failed to continue to payment portal");
    } finally {
      setLoading(false);
    }
  };

  //   handle redeem Voucher
  const handleRedeemVoucher = () => {
    try {
      setLoading(true);
      const macAddress = searchParams.get("mac").toUpperCase();
      navigate("/voucher", {
        state: {
          macAddress,
        },
      });
    } catch {
      toast.error("Failed to continue to voucher page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-gray-100
        flex
        items-center
        justify-center
        p-6
      "
    >
      <div
        className="
          w-full
          max-w-4xl
          bg-white
          rounded-2xl
          shadow-xl
          p-8
        "
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Wifi size={60} />
          </div>

          <h1
            className="
              text-4xl
              font-bold
              mb-2
            "
          >
            Welcome to WiFi Hotspot
          </h1>

          <p
            className="
              text-gray-500
            "
          >
            Choose how you'd like to access the internet
          </p>
        </div>

        {/* Options */}
        <div
          className="
            grid
            md:grid-cols-2
            gap-8
          "
        >
          {/* Buy Package Card */}
          <Link
            to="/payment-portal"
            className="
              border
              rounded-2xl
              p-8
              hover:shadow-lg
              transition
              duration-300
              hover:scale-105
              text-center
            "
          >
            <div className="flex justify-center mb-4">
              <CreditCard size={50} />
            </div>

            <h2
              className="
                text-2xl
                font-bold
                mb-3
              "
            >
              Buy Package
            </h2>

            <p className="text-gray-500">
              Purchase internet access using MTN MoMo or Airtel Money.
            </p>

            <button
              onClick={handleBuy}
              disabled={loading}
              className="
                mt-6
                bg-black
                text-white
                px-6
                py-3
                rounded-lg
              "
            >
              {loading ? <>loading...</> : <>Buy Now</>}
            </button>
          </Link>

          {/* Voucher Card */}
          <Link
            to="/voucher"
            className="
              border
              rounded-2xl
              p-8
              hover:shadow-lg
              transition
              duration-300
              hover:scale-105
              text-center
            "
          >
            <div className="flex justify-center mb-4">
              <Ticket size={50} />
            </div>

            <h2
              className="
                text-2xl
                font-bold
                mb-3
              "
            >
              Redeem Voucher
            </h2>

            <p className="text-gray-500">
              Already have a voucher code? Redeem it here to activate internet
              access.
            </p>

            <button
              onClick={handleRedeemVoucher}
              disabled={loading}
              className="
                mt-6
                bg-green-600
                text-white
                px-6
                py-3
                rounded-lg
              "
            >
              {loading ? <>loading...</> : <>Redeem Voucher</>}
            </button>
          </Link>
        </div>

        {/* Footer */}
        <div
          className="
            mt-10
            text-center
            text-sm
            text-gray-400
          "
        >
          Powered by Gilboy Technologies Copyright {Date().year}
        </div>
      </div>
    </div>
  );
};

export default CustomerHomePage;
