import axios from "axios";
import { useRouter } from "next/navigation";

const interceptor = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL, // Your API Base URL
});

// Request Interceptor
interceptor.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (
      !config.url.includes("login") &&
      !config.url.includes("signup") &&
      token
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure Content-Type is properly set for file uploads
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = undefined;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
interceptor.interceptors.response.use(
  (response) => response, // Return response if successful
  (error) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default interceptor;
