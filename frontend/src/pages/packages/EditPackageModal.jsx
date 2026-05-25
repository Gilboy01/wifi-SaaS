import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const EditPackageModal = ({
  isOpen,
  onClose,
  packageData,
  hotspots,
  onUpdated,
}) => {
  const [formData, setFormData] = useState({
    hotspotId: "",
    name: "",
    price: "",
    duration: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  // show package data on load
  useEffect(() => {
    if (packageData) {
      setFormData({
        hotspotId: packageData.hotspotId?._id || packageData.hotspotId || "",
        name: packageData.name || "",
        price: packageData.price || "",
        duration: packageData.duration || "",
        isActive: packageData.isActive,
      });
    }
  }, [packageData]);

  //   handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //   on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/packages/${packageData._id}`, formData);
      toast.success("Package updated");
      onUpdated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          p-6
          rounded-xl
          w-full
          max-w-lg
        "
      >
        <h2
          className="
            text-xl
            font-semibold
            mb-4
          "
        >
          Edit Package
        </h2>

        <form
          onSubmit={handleSubmit}
          className="
            grid
            gap-4
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
            placeholder="Package name"
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
            placeholder="Price (UGX)"
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
            placeholder="Duration (min)"
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

          <div
            className="
              flex
              gap-3
            "
          >
            <button
              type="submit"
              disabled={loading}
              className="
                flex-1
                bg-black
                text-white
                p-3
                rounded-lg
              "
            >
              {loading ? <>loading...</> : <>Save</>}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="
                flex-1
                border
                p-3
                rounded-lg
              "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPackageModal;
