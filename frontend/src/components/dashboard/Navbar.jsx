const Navbar = () => {
  return (
    <div
      className="
      bg-white
      shadow-sm
      h-16
      px-6
      flex
      items-center
      justify-between
    "
    >
      <h2
        className="
        text-xl
        font-semibold
      "
      >
        Admin Dashboard
      </h2>

      <div>
        <button
          className="
          bg-black
          text-white
          px-4
          py-2
          rounded-lg
        "
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
