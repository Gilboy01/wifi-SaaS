import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../../api/axios";

const HotspotsPage = () => {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    routerIp: "",
    routerUsername: "",
    routerPassword: "",
    routerPort: "",
  });

  // fetch hotspots
  const fetchHotspots = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hotspots");
      // res.data is the body of response
      //  res.data is optional chained sothat in case it is null or undefined the whole expression is undefined
      // res.data?.data gets data property inside res.data but safely
      const hotspotsData = res.data?.data;

      // this checks if hotspotsData is an array
      if (Array.isArray(hotspotsData)) {
        setHotspots(hotspotsData);
      } else {
        console.error("Unexpected hotspots response:", res.data);
        setHotspots([]);
      }
    } catch (error) {
      console.log(error);
      setHotspots([]);
    } finally {
      setLoading(false);
    }
  };

  // run whenever hotspots page is openned
  useEffect(() => {
    fetchHotspots();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // create hotspot
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/hotspots/", formData);
      toast.success("Hotspot added successfully");
      setFormData({
        name: "",
        location: "",
        routerIp: "",
        routerUsername: "",
        routerPassword: "",
        routerPort: "",
      });

      fetchHotspots();
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // delete hotspot
  const handleDelete = async (id) => {
    try {
      await api.delete(`/hotspots/${id}`);
      toast.success("Hotspot deleted successfully");

      fetchHotspots();
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

  return (
    <div>
      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >
        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Create Hotspot
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          p-6
          rounded-xl
          shadow-md
          mb-8
          grid
          grid-cols-2
          gap-4
          auto-rows-max
        "
      >
        <input
          type="text"
          name="name"
          placeholder="Hotspot Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          name="routerIp"
          placeholder="Router IP"
          value={formData.routerIp}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          name="routerUsername"
          placeholder="Router Username"
          value={formData.routerUsername}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="password"
          name="routerPassword"
          placeholder="Router Password"
          value={formData.routerPassword}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="number"
          name="routerPort"
          placeholder="Router Port"
          value={formData.routerPort}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="
            col-span-2
            bg-black
            text-white
            rounded-lg
            p-3
            w-fit
            mx-auto
            mt-4
          "
          disabled={loading}
        >
          {loading ? <>Loading...</> : <>Create Hotspot</>}
        </button>
      </form>

      <div
        className="
          flex
          items-center
          justify-center
          mb-6
        "
      >
        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Hotspots
        </h1>
      </div>

      {loading ? (
        <p>Loading hotspots...</p>
      ) : hotspots.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <p className="text-gray-600">
            No hotspots exist yet. Create one to start managing your network.
          </p>
        </div>
      ) : (
        <div
          className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
        >
          {hotspots.map((hotspot) => (
            <div
              key={hotspot._id}
              className="
                    bg-white
                    p-6
                    rounded-xl
                    shadow-md
                  "
            >
              <h2
                className="
                      text-xl
                      font-bold
                      mb-2
                    "
              >
                Hotspot: {hotspot.name}
              </h2>
              <p>Location: {hotspot.location}</p>
              <p>RouterIp: {hotspot.routerIp}</p>
              <p>Username: {hotspot.routerUsername}</p>
              <p>Password: {hotspot.routerPassword}</p>
              <p>Port: {hotspot.routerPort}</p>

              <button
                onClick={() => handleDelete(hotspot._id)}
                className="
                      mt-4
                      bg-red-500
                      text-white
                      px-4
                      py-2
                      rounded-lg
                    "
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotspotsPage;
