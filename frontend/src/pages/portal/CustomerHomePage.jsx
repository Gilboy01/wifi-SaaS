import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Wifi, CreditCard, Ticket } from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const CustomerHomePage = () => {
  const { hotspotId } = useParams();
  const [hotspot, setHotspot] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  //   fetch hotspot
  const fetchHotspot = async () => {
    try {
      setLoading(true);
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
  }, [hotspotId]);

  //   handle buy now
  const handleBuy = (e) => {
    e.preventDefault(); // Prevent any parent triggers

    const mac = searchParams.get("mac");
    navigate("/payment-portal", {
      state: {
        hotspot,
        hotspotId,
        macAddress: mac.toUpperCase(),
      },
    });
  };

  //   handle redeem Voucher
  const handleRedeemVoucher = (e) => {
    e.preventDefault();
    const mac = searchParams.get("mac").toUpperCase();
    navigate("/voucher", {
      state: {
        macAddress: mac.toUpperCase(),
      },
    });
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
          <div
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
          </div>

          {/* Voucher Card */}
          <div
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
              className="
                mt-6
                bg-green-600
                text-white
                px-6
                py-3
                rounded-lg
              "
            >
              Redeem Voucher
            </button>
          </div>
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
          Powered by Gilboy Technologies Copyright {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default CustomerHomePage;
