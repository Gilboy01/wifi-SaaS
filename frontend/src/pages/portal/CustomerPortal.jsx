import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CustomerPortal = () => {
  const { hotspotId } = useParams();
  const [hotspot, setHotspot] = useState(null);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //   fetch hotspot
  const fetchHotspot = async () => {
    try {
      const res = await api.get(`public/hotspots/${hotspotId}`);
      setHotspot(res.data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Hotspot not found");
    } finally {
      setLoading(false);
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

  // load on app start
  useEffect(() => {
    fetchHotspot();
    fetchPackages();
  }, [hotspotId]);

  // for searching mac address from url
  const [searchParams] = useSearchParams();

  // select package
  const handleSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  //   continue to next step
  const handleContinue = async () => {
    setLoading(true);
    if (!selectedPackage) {
      toast.error("Select package");
      return;
    }

    if (!phone) {
      toast.error("Enter phone");
      return;
    }

    // got ftom url
    const macAddress = searchParams.get("mac");

    try {
      const res = await api.post("/payments/initiate", {
        hotspotId,
        packageId: selectedPackage._id,
        phoneNumber: phone,
        macAddress,
      });
      console.log(res.data);
      const payment = res.data?.payment;
      // const paymentId = res.data?._id;

      // go to confirm page
      navigate("/confirm-payment", {
        state: {
          payment,
          packageName: selectedPackage.name,
        },
      });

      // await confirmPayment(paymentId);
    } catch (error) {
      toast.error(error.response?.data?.message || "payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  // confirm payment
  // const confirmPayment = async (paymentId) => {
  //   try {
  //     const res = await api.post(`/payments/mock-success/${paymentId}`);

  //     if (res.data.success) {
  //       toast.success("Payment confirmed. Internet activated.");

  //       console.log("Session:", res.data);

  //       // optional redirect
  //       // navigate("/success");
  //     }
  //   } catch (error) {
  //     console.error(error);

  //     toast.error(
  //       error.response?.data?.message || "Payment confirmation failed",
  //     );
  //   }
  // };

  return (
    <>
      {loading ? (
        <div
          className="text-3xl 
    flex items-center justify-center"
        >
          loading...
        </div>
      ) : (
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
              {hotspot?.name} hotspot
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
              placeholder="07xxxxxxxx"
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
              disabled={loading}
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
      )}
    </>
  );
};

export default CustomerPortal;
