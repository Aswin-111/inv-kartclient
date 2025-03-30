"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import interceptor from "@/app/utils/interceptor";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "", // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword, role } = formData;

    if (!name || !email || !phone || !password || !confirmPassword || !role) {
      toast.error("All fields are required!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await interceptor.post("/users/signup", formData);
      toast.success("Signup successful! Redirecting...");
      setTimeout(() => router.push("/login"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-xl font-semibold mb-4">Signup</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />

        {/* Role Dropdown */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded bg-white"
        >
          <option value="user">user</option>
          <option value="designer">designer</option>
          <option value="printer">printer</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
