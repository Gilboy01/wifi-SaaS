import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch sessions
  const fetchSessions = async () => {
    try {
      const res = await api.get("/sessions");
      setSessions(res.data?.sessions || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load sessions");
    } finally {
      setLoading(false);
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
    } catch (error) {
      toast.error(error.response?.data?.message || "Disconnect failed");
    }
  };

  // delete session
  const deleteSession = async (id) => {
    try {
      await api.delete(`/sessions/delete/${id}`);
      toast.success("session deleted successfully");

      fetchSessions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete session");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Sessions</h2>
        <div className="flex items-center justify-center">
          <p>Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Sessions</h2>
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">No sessions available</h1>
        </div>
      </div>
    );
  }

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
                  {session.status === "active" ? (
                    <button
                      onClick={() => disconnect(session._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => deleteSession(session._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
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
