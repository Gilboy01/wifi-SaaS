import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import { useState } from "react";

const ConfirmPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { payment, packageName } = location.state || {};

  if (!payment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Payment not found
      </div>
    );
  }

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await api.post(`/payments/mock-success/${payment._id}`);
      toast.success("Payment successful");
      navigate("/payment-success");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-xl font-bold mb-6">Confirm Payment</h2>

      <div className="space-y-3">
        <p>
          <strong>Package:</strong> {packageName}
        </p>

        <p>
          <strong>Amount:</strong> {payment.amount} UGX
        </p>

        <p>
          <strong>Phone:</strong> {payment.phoneNumber}
        </p>

        <p>
          <strong>Provider:</strong> {payment.provider}
        </p>

        <p>
          <strong>MAC:</strong> {payment.macAddress}
        </p>
      </div>

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg"
      >
        {loading ? <>loading...</> : <>Confirm</>}
      </button>
    </div>
  );
};

export default ConfirmPayment;
