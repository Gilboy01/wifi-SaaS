import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import api from "../../api/axios";

const SignupPage = () => {
  const [businessName, setBusinnessName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, setUser, setLoading } = useAuth();
  const navigate = useNavigate();

  // signup handler
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (confirmPassword !== password) {
        return toast.error("Passwords do not match");
      }

      const res = await api.post("/auth/register", {
        businessName,
        name,
        email,
        password,
      });

      toast.success(res.data.message || "Registered successfully");
      // console.log(res.data);
      setUser(res.data.user);

      setBusinnessName("");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/dashboard");
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed";
      toast.error(message);
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h1
          className="
            text-2xl
            font-bold
            mb-4
          "
        >
          Register business
        </h1>

        <input
          type="text"
          placeholder="Businness name"
          value={businessName}
          onChange={(e) => setBusinnessName(e.target.value)}
          className="
            w-full
            border
            p-2
            mb-3
          "
        />

        <input
          type="text"
          placeholder="Owner's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            w-full
            border
            p-2
            mb-3
          "
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          disabled={loading}
        >
          {loading ? <>Loding...</> : <>Register</>}
        </button>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an Account?
          <Link
            to="/login"
            className="font-medium text-gray-600 hover:text-emerald-400"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
