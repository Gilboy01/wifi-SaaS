import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

const VoucherPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //   const [searchParams] = useSearchParams();
  // MAC usually comes from captive portal URL
  //   const macAddress = searchParams.get("mac") || "";

  // load state from previous page
  const { macAddress } = location.state || {};
  const [voucherCode, setVoucherCode] = useState("");

  const [loading, setLoading] = useState(false);

  if (!macAddress) {
    return (
      <div className="text-3xl flex min-h-screen items-center justify-center">
        No MacAddress
      </div>
    );
  }

  const handleRedeem = async (e) => {
    e.preventDefault();

    if (!voucherCode.trim()) {
      return toast.error("Voucher code is required");
    }

    try {
      setLoading(true);

      const res = await api.post("/vouchers/redeem", {
        code: voucherCode.trim(),
        macAddress,
      });

      if (res.data.success) {
        toast.success("Voucher redeemed successfully");

        navigate("/payment-success", {
          state: {
            session: res.data.session,
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Voucher redemption failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
    "
    >
      <div
        className="
        bg-white
        p-8
        rounded-xl
        shadow-lg
        w-full
        max-w-md
      "
      >
        <h1
          className="
          text-2xl
          font-bold
          mb-6
          text-center
        "
        >
          Redeem Voucher
        </h1>

        <form onSubmit={handleRedeem}>
          <input
            type="text"
            placeholder="Enter Voucher Code"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
            className="
              w-full
              border
              p-3
              rounded-lg
              mb-4
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-green-500
              text-white
              p-3
              rounded-lg
            "
          >
            {loading ? <>Redeeming...</> : <>Redeem Voucher</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VoucherPage;
