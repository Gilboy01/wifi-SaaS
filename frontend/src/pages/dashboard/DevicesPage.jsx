import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const DevicesPage = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch all devices
  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/devices");

      setDevices(res.data.devices);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch devices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // disconnect device
  const handleDisconnect = async (id) => {
    try {
      await api.post(`/devices/disconnect/${id}`);

      toast.success("Device disconnected");

      fetchDevices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to disconnect");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Sessions</h2>
        <div className="flex items-center justify-center">
          <p>Loading devices...</p>
        </div>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6"> Devices </h2>
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">No devices available</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1
        className="
        text-2xl
        font-bold
      "
      >
        Devices
      </h1>

      <div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-400">
              <th className="w-1/4 px-4 py-2 text-left border">MAC</th>
              <th className="w-1/4 px-4 py-2 text-left border">Hotspot</th>
              <th className="w-1/4 px-4 py-2 text-left border">Last Seen</th>
              <th className="w-1/4 px-4 py-2 text-left border">Status</th>
              <th className="w-1/4 px-4 py-2 text-left border">Action</th>
            </tr>
          </thead>

          <tbody>
            {devices.map((device) => (
              <tr key={device._id} className="border-t">
                <td className="w-1/4 px-4 py-2 border">{device.macAddress}</td>

                <td className="w-1/4 px-4 py-2 border">
                  {device.hotspotId?.name}
                </td>

                <td className="w-1/4 px-4 py-2 border">
                  {new Date(device.lastSeen).toLocaleString()}
                </td>

                <td
                  className={
                    device.status === "online"
                      ? "text-green-500 w-1/4 px-4 py-2 border"
                      : "text-red-500 w-1/4 px-4 py-2 border"
                  }
                >
                  {device.status}
                </td>

                <td className="w-1/4 px-4 py-2 border">
                  <button
                    onClick={() => handleDisconnect(device._id)}
                    className="
              bg-red-500
              text-white
              px-3
              py-1
              rounded
            "
                  >
                    Disconnect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DevicesPage;
