import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);

  // fetch sessions
  const fetchSessions = async () => {
    try {
      const res = await api.get("/sessions/active");
      setSessions(res.data.sessions);
    } catch {
      toast.error("Failed to load sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // disconnect session
  const disconnect = async (id) => {
    try {
      await api.patch(`/sessions/disconnect/${id}`);
      toast.success("Session disconnected");

      fetchSessions();
    } catch {
      toast.error("Disconnect failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Sessions</h2>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-400 border-t-2">
              <th>MAC</th>
              <th>Package</th>
              <th>Started</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((session) => (
              <tr key={session._id} className="border-t">
                <td>{session.macAddress}</td>
                <td>{session.packageId?.name}</td>
                <td>{new Date(session.startTime).toLocaleString()}</td>
                <td>{new Date(session.expiryTime).toLocaleString()}</td>
                <td
                  className={`${
                    session.status === "active"
                      ? "text-green-500"
                      : "text-red-500"
                  } font-medium`}
                >
                  {session.status}
                </td>
                <td>
                  {session.status === "active" && (
                    <button
                      onClick={() => disconnect(session._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Disconnect
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sessions;
