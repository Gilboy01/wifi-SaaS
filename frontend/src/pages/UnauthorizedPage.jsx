import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
        px-4
      "
    >
      <div
        className="
          bg-white
          p-10
          rounded-2xl
          shadow-lg
          text-center
          max-w-md
          w-full
        "
      >
        <h1
          className="
            text-6xl
            font-bold
            text-red-500
            mb-4
          "
        >
          403
        </h1>

        <h2
          className="
            text-2xl
            font-semibold
            mb-3
          "
        >
          Access Denied
        </h2>

        <p
          className="
            text-gray-600
            mb-6
          "
        >
          You do not have permission to access this page.
        </p>

        <Link
          to="/dashboard"
          className="
            inline-block
            bg-black
            text-white
            px-6
            py-3
            rounded-lg
            hover:bg-gray-800
            transition
          "
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
