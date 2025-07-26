import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/NewContext";
import api from "../../api";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/");
        toast.success("Logged in successfully!");
    } catch (err) {
       toast.error(err.response?.data?.message|| "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input type="email" name="email" placeholder="Email" className="w-full mb-3 p-2 rounded bg-gray-700" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="w-full mb-3 p-2 rounded bg-gray-700" onChange={handleChange} required />
        <button className="bg-purple-600 w-full p-2 rounded hover:bg-purple-700 text-black">Login</button>
        <p className="mt-3 text-sm">Don't have an account? <Link to="/signup" className="text-blue-400">Sign up</Link></p>
        <p className="mt-3 text-sm">
  <Link to="/forgot-password" className="text-blue-400">Forgot Password?</Link>
</p>

      </form>
    </div>
  );
};

export default Login;
