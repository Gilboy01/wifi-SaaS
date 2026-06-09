import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();

  const { voucher } = location.state || {};

  return (
    <div
      className="
        max-w-md
        mx-auto
        mt-20
        bg-white
        p-8
        rounded-xl
        shadow-lg
      "
    >
      <h1
        className="
          text-2xl
          font-bold
          text-green-600
          mb-4
        "
      >
        Payment Successful
      </h1>

      <p className="mb-6">Internet access has been activated.</p>

      {voucher && (
        <div
          className="
            border-2
            border-dashed
            p-4
            rounded-lg
            bg-gray-50
          "
        >
          <p className="text-xl text-gray-500">Your Voucher Code</p>

          <h2
            className="
              text-xl
              font-bold
              mt-2
            "
          >
            {voucher.code}
          </h2>

          <p
            className="
              text-xs
              text-gray-500
              mt-2
            "
          >
            Save this code to use on another device.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
