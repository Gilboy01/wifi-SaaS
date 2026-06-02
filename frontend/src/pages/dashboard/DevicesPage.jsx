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
            <tr>
              <th>MAC</th>
              <th>Hotspot</th>
              <th>Last Seen</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {devices.map((device) => (
              <tr key={device._id}>
                <td>{device.macAddress}</td>

                <td>{device.hotspotId?.name}</td>

                <td>{new Date(device.lastSeen).toLocaleString()}</td>

                <td
                  className={
                    device.status === "online"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {device.status}
                </td>

                <td>
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
