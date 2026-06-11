import { useEffect, useState } from "react";
import api from "../../api/axios";

const DashboardPage = () => {
  // const [stats, setStats] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setDashboard(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <p className="flex min-h-screen items-center justify-center">
        Loading...
      </p>
    );

  if (!dashboard)
    return (
      <p className="flex min-h-screen items-center justify-center">
        Failed to load dashbord data
      </p>
    );
  return (
    <div>
      <h1
        className="
        text-3xl
        font-bold
        mb-8
      "
      >
        Dashboard
      </h1>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >
        <Card title="Hotspots" value={dashboard?.stats.totalHotspots} />
        <Card title="Active Sessions" value={dashboard?.stats.activeSessions} />
        <Card title="Payments" value={dashboard?.stats.totalPayments} />
        <Card
          title="Revenue"
          value={`UGX. ${dashboard?.stats.revenue.toLocaleString()}`}
        />
      </div>

      <div
        className="
        bg-white
        rounded-xl
        shadow-md
        mt-8
        p-6
      "
      >
        <h2
          className="
          text-xl
          font-bold
          mb-4
        "
        >
          Recent Payments
        </h2>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-400">
              <th className="w-1/4 px-4 py-2 text-left border">Phone</th>
              <th className="w-1/4 px-4 py-2 text-left border">Amount</th>
              <th className="w-1/4 px-4 py-2 text-left border">Status</th>
            </tr>
          </thead>

          <tbody>
            {dashboard.recentPayments.map((payment) => (
              <tr key={payment._id}>
                <td className="w-1/4 px-4 py-2 border">
                  {payment.phoneNumber}
                </td>
                <td className="w-1/4 px-4 py-2 border">UGX {payment.amount}</td>
                <td className="w-1/4 px-4 py-2 border">{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="
    bg-white
    rounded-xl
    shadow-md
    mt-8
    p-6
  "
      >
        <h2
          className="
      text-xl
      font-bold
      mb-4
    "
        >
          Packages
        </h2>

        <div
          className="
      grid
      md:grid-cols-3
      gap-4
    "
        >
          {dashboard.packages.map((pkg) => (
            <div
              key={pkg._id}
              className="
            border
            p-4
            rounded-lg
          "
            >
              <h3
                className="
              font-bold
            "
              >
                {pkg.name}
              </h3>

              <p>UGX {pkg.price}</p>

              <p>{pkg.duration} mins</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div
    className="
      bg-white
      p-6
      rounded-xl
      shadow-md
    "
  >
    <h3
      className="
        text-gray-500
        text-sm
      "
    >
      {title}
    </h3>

    <p
      className="
        text-3xl
        font-bold
        mt-2
      "
    >
      {value}
    </p>
  </div>
);

export default DashboardPage;
