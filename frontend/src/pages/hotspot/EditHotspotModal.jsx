import { useState } from "react";
import toast from "react-hot-toast";

import api from "../../api/axios";

const EditHotspotModal = ({ hotspot, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: hotspot.name || "",
    location: hotspot.location || "",
    routerIp: hotspot.routerIp || "",
    routerUsername: hotspot.routerUsername || "",
    routerPassword: hotspot.routerPassword || "",
    routerPort: hotspot.routerPort || "",
    isActive: hotspot.isActive ?? true,
  });

  const [loading, setLoading] = useState(false);

  //Handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //   Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/hotspots/${hotspot._id}`, formData);

      onUpdated();

      onClose();
      toast.success("Updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          p-6
          w-full
          max-w-lg
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >
          <h2
            className="
              text-2xl
              font-bold
            "
          >
            Edit Hotspot
          </h2>

          <button
            onClick={onClose}
            className="
              text-gray-500
              text-xl
            "
          >
            x
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Hotspot Name"
            value={formData.name}
            onChange={handleChange}
            className="
              w-full
              border
              p-3
              rounded-lg
            "
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="
              w-full
              border
              p-3
              rounded-lg
            "
          />

          <input
            type="text"
            name="routerIp"
            placeholder="Router IP"
            value={formData.routerIp}
            onChange={handleChange}
            className="
              w-full
              border
              p-3
              rounded-lg
            "
          />

          <input
            type="text"
            name="routerUsername"
            placeholder="Router Username"
            value={formData.routerUsername}
            onChange={handleChange}
            className="
              w-full
              border
              p-3
              rounded-lg
            "
          />

          <input
            type="password"
            name="routerPassword"
            placeholder="
              New Router Password
            "
            value={formData.routerPassword}
            onChange={handleChange}
            className="
              w-full
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
            w-full
            border
            p-3
            rounded-lg
          "
          >
            <option value="true">Active</option>

            <option value="false">Inactive</option>
          </select>

          <input
            type="number"
            name="routerPort"
            placeholder="
              New Router Port
              (optional)
            "
            value={formData.routerPort}
            onChange={handleChange}
            className="
              w-full
              border
              p-3
              rounded-lg
            "
          />

          <div
            className="
              flex
              justify-end
              gap-3
              pt-4
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                px-4
                py-2
                border
                rounded-lg
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                bg-black
                text-white
                px-6
                py-2
                rounded-lg
              "
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotspotModal;
