import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../api/axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // login handler
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      toast.success(res.data.message || "Logged in successfully");
      console.log(res.data);
      setEmail("");
      setPassword("");
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-lg shadow-md w-96"
        >
          <h1
            className="
            text-2xl
            font-bold
            mb-4
            text-center
          "
          >
            Login
          </h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
            w-full
            border
            p-2
            mb-3
          "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
            w-full
            border
            p-2
            mb-3
          "
          />

          <button
            type="submit"
            className="
            w-full
            bg-black
            text-white
            p-2
          "
          >
            Login
          </button>

          <p className="mt-8 text-center text-sm text-gray-500">
            Have no Account?
            <Link
              to="/register"
              className="font-medium text-gray-600 hover:text-emerald-400"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
