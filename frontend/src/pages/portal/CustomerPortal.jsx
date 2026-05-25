import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

const CustomerPortal = () => {
  const { hotspotId } = useParams();
  const [hotspot, setHotspot] = useState(null);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  //   fetch hotspot
  const fetchHotspot = async () => {
    try {
      const res = await api.get(`public/hotspots/${hotspotId}`);
      setHotspot(res.data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Hotspot not found");
    }
  };

  //   fetch packages
  //  GET /packages?hotspotId=xxx
  const fetchPackages = async () => {
    try {
      const res = await api.get(`/public/packages/${hotspotId}`);

      setPackages(res.data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotspot();
    fetchPackages();
  }, [hotspotId]);

  const handleSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  //   continue to next step
  const handleContinue = () => {
    if (!selectedPackage) {
      toast.error("Select package");
      return;
    }

    if (!phone) {
      toast.error("Enter phone");
      return;
    }

    console.log({
      hotspotId,
      packageId: selectedPackage._id,
      phone,
    });

    toast.success("Proceeding to payment");
  };

  return (
    <div
      className="
      min-h-screen
      bg-gray-100
      p-6
    "
    >
      <div
        className="
    max-w-3xl
    mx-auto
  "
      >
        <h1
          className="
      text-2xl
      font-bold
      mb-2
    "
        >
          {hotspot?.name}
        </h1>

        <p
          className="
      text-gray-500
      mb-6
    "
        >
          Choose your package
        </p>

        <div
          className="
    grid
    gap-4
  "
        >
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              onClick={() => handleSelect(pkg)}
              className={`
        p-5
        rounded-xl
        cursor-pointer
        border

        ${
          selectedPackage?._id === pkg._id
            ? "border-black bg-white"
            : "bg-white"
        }
      `}
            >
              <h2>{pkg.name}</h2>

              <p>UGX {pkg.price}</p>

              <p>
                {pkg.duration}
                mins
              </p>
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="
    07xxxxxxxx
  "
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="
    w-full
    border
    p-3
    rounded-lg
    mt-6
  "
        />

        <button
          onClick={handleContinue}
          className="
    w-full
    bg-black
    text-white
    p-4
    rounded-xl
    mt-4
  "
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default CustomerPortal;
