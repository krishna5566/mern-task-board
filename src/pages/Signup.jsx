import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", form);
      navigate("/login");
            toast.success("Register successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message|| "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <input type="text" name="name" placeholder="Name" className="w-full mb-3 p-2 rounded bg-gray-700" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="w-full mb-3 p-2 rounded bg-gray-700" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="w-full mb-3 p-2 rounded bg-gray-700" onChange={handleChange} required />
        <button className="bg-green-600 w-full p-2 rounded hover:bg-green-700 text-black">Sign Up</button>
        <p className="mt-3 text-sm">Already have an account? <Link to="/login" className="text-blue-400">Login</Link></p>
      </form>
    </div>
  );
};

export default Signup;
