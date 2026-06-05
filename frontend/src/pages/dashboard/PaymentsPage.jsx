import { useEffect, useState } from "react";

import api from "../../api/axios";

import { toast } from "react-hot-toast";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/payments");

      setPayments(res.data.payments);
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Payments</h2>
        <div className="flex items-center justify-center">
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6"> Payment </h2>
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">No payments available</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Payments</h2>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-400">
              <th className="w-1/4 px-4 py-2 text-left border">Phone</th>
              <th className="w-1/4 px-4 py-2 text-left border">Package</th>
              <th className="w-1/4 px-4 py-2 text-left border">Amount</th>
              <th className="w-1/4 px-2 py-2 text-left border">Method</th>
              <th className="w-1/4 px-4 py-2 text-left border">Status</th>
              <th className="w-1/4 px-4 py-2 text-left border">Reference</th>
              <th className="w-1/4 px-4 py-2 text-left border">Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-t">
                <td className="w-1/4 px-4 py-2 border">
                  {payment.phoneNumber}
                </td>
                <td className="w-1/4 px-4 py-2 border">
                  {payment.packageId?.name}
                </td>
                <td className="w-1/4 px-4 py-2 border">UGX {payment.amount}</td>
                <td className="w-1/4 px-2 py-2 border">{payment.provider}</td>
                <td
                  className={`font-medium w-1/4 px-4 py-2 border ${
                    payment.status === "success"
                      ? "text-green-500"
                      : payment.status === "pending"
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {payment.status}
                </td>

                <td className="w-1/4 px-4 py-2 border">
                  {payment.transactionId}
                </td>

                <td className="w-1/4 px-4 py-2 border">
                  {new Date(payment.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
