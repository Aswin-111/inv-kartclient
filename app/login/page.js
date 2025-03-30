"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import interceptor from "@/app/utils/interceptor";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await interceptor.post("/users/login", formData);
      console.log(response);

      const token = response.data.token;
      localStorage.setItem("authToken", token);
      toast.success("Login successful!");
      setTimeout(() => router.push("/products/allproducts"), 1000); // Redirect after toast
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
