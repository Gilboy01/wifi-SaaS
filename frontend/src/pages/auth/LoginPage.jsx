import { useState } from "react";

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

      console.log(res.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="
          bg-white
          p-6
          rounded-lg
          shadow-md
          w-96
        "
      >
        <h1
          className="
            text-2xl
            font-bold
            mb-4
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
          className="
            w-full
            bg-black
            text-white
            p-2
          "
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
