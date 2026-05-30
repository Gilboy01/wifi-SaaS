import { useEffect, useState } from "react";

import api from "../../api/axios";

import { toast } from "react-hot-toast";

const Payments = () => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments");

      setPayments(res.data.payments);
    } catch {
      toast.error("Failed to load payments");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Payments</h2>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-400">
              <th>Phone</th>

              <th>Package</th>

              <th>Amount</th>

              <th>Method</th>

              <th>Status</th>

              <th>Reference</th>

              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-t">
                <td>{payment.phoneNumber}</td>

                <td>{payment.packageId?.name}</td>

                <td>UGX {payment.amount}</td>

                <td>{payment.provider}</td>

                <td
                  className={`font-medium ${
                    payment.status === "success"
                      ? "text-green-500"
                      : payment.status === "pending"
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {payment.status}
                </td>

                <td>{payment.transactionId}</td>

                <td>{new Date(payment.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
