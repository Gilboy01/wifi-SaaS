import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import api from "../../api/axios";
const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    hotspotId: "",
    name: "",
    price: "",
    duration: "",
    isActive: true,
  });

  // Fetch hotspots
  const fetchHotspots = async () => {
    try {
      const res = await api.get("/hotspots");
      setHotspots(res.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  //  Fetch packages
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/packages");
      setPackages(res.data?.data || []);
    } catch (error) {
      console.log(error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  // load both packages n hotspots
  useEffect(() => {
    fetchHotspots();
    fetchPackages();
  }, []);

  // Handle inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // create package
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/packages", formData);

      toast.success("Package created successfully");

      setFormData({
        hotspotId: "",
        name: "",
        price: "",
        duration: "",
        isActive: true,
      });

      fetchPackages();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // delete package
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/packages/${id}`);
      toast.success("Package deleted successfully");
      fetchPackages();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
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
          Create Package
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
        <select
          name="hotspotId"
          value={formData.hotspotId}
          onChange={handleChange}
          className="
            border
            p-3
            rounded-lg
          "
        >
          <option value="">Select hotspot</option>

          {hotspots.map((hotspot) => (
            <option key={hotspot._id} value={hotspot._id}>
              {hotspot.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          placeholder="Package Name"
          value={formData.name}
          onChange={handleChange}
          className="
          border
          p-3
          rounded-lg
        "
        />

        <input
          type="number"
          name="price"
          placeholder="Price in ugx"
          value={formData.price}
          onChange={handleChange}
          className="
          border
          p-3
          rounded-lg
        "
        />

        <input
          type="number"
          name="duration"
          placeholder=" Duration (minutes)"
          value={formData.duration}
          onChange={handleChange}
          className="
          border
          p-3
          rounded-lg
        "
        />

        <select
          name="isActive"
          value={String(formData.isActive)}
          onChange={(e) =>
            setFormData({
              ...formData,
              isActive: e.target.value === "true",
            })
          }
          className="
                    border
                    p-3
                    rounded-lg
                  "
        >
          <option value="true">Active</option>

          <option value="false">Inactive</option>
        </select>

        <button
          type="submit"
          disabled={loading}
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
        >
          {loading ? <>Loading...</> : <>Create Package</>}
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
          Packages
        </h1>
      </div>
      {loading ? (
        <p>Loading packages...</p>
      ) : hotspots.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <p className="text-gray-600">
            No packages exist yet. Create one to start managing your network.
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
          {packages.map((pkg) => (
            <div
              key={pkg._id}
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
                {pkg.name}
              </h2>

              <p>Price: UGX.{pkg.price}</p>

              <p>Duration:{pkg.duration} mins</p>

              <p>Hotspot: {pkg.hotspotId}</p>

              <p>
                Status:
                {pkg.isActive ? (
                  <span className="text-green-600"> Active</span>
                ) : (
                  <span className="text-red-600"> InActive</span>
                )}
              </p>

              <button
                onClick={() => handleDelete(pkg._id)}
                className="
          mt-4
          bg-red-500
          text-white
          px-4
          py-2
          rounded-lg
        "
              >
                {loading ? <>Loading...</> : <>Delete</>}
              </button>
            </div>
          ))}
        </div>
      )}
      ;
    </div>
  );
};
export default PackagesPage;
