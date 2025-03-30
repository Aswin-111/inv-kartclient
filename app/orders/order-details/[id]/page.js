"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import interceptor from "@/app/utils/interceptor";
import { MdOutlineAddAPhoto } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";

import { useRouter } from "next/navigation";

function OrderDetailsPage() {
  const [leadData, setLeadData] = useState({});
  const [productData, setProductData] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [address, setAddress] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const generateOrderId = () => {
      const timestamp = Date.now().toString().slice(-10); // Get last 10 digits
      setOrderId(`DOR-${timestamp}`);
    };

    generateOrderId();
  }, []);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await interceptor.get(`/orders/getleaddetails/${id}`);
        console.log(response.data);

        setProductData(response.data.product_details);
        setLeadData(response.data.lead_details[0]);
        if (response.data.lead_details.address) {
          setAddress(response.data.lead_details.address);
        }
      } catch (error) {
        console.error("Error fetching lead:", error);
      }
    };
    fetchLead();
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map((file) => {
      return {
        file: file,
        preview: URL.createObjectURL(file),
      };
    });
    setSelectedImages((prevImages) => [...prevImages, ...images]);
  };

  const removeImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!selectedProduct) newErrors.product = "Please select a product.";
    if (!address) newErrors.address = "Please enter an address.";
    if (selectedImages.length === 0)
      newErrors.images = "Please upload at least one image.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("order_id", orderId);
    formData.append("customer_name", leadData.name || "");
    formData.append("phone", leadData.phone || "");
    formData.append("address", address);
    formData.append("product_id", selectedProduct);
    formData.append("lead_id", id);

    selectedImages.forEach((image, index) => {
      formData.append("productPhoto", image.file);
    });

    try {
      const response = await interceptor.post("/orders/order", formData);
      console.log("Order submitted successfully:", response.data);
      if (response.data.status === "success") {
        toast.success("Order submitted successfully!");
        router.push("/orders/allorders");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Info */}
        <div className="card h-[50vh] bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <p className="font-medium">Order ID:</p>
          <span className="text-blue-600">{orderId}</span>
          <p className="font-medium mt-4">Customer Name:</p>
          <span>{leadData.name || "N/A"}</span>
          <p className="font-medium mt-2">Phone:</p>
          <span>{leadData.phone || "N/A"}</span>
          <p className="font-medium mt-2">Address:</p>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter delivery address"
            className="input input-bordered w-full"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>

        {/* Product Selection */}
        <div className="card bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Select Product</h2>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">Choose a product...</option>
            {productData.map((product) => (
              <option key={product._id} value={product._id}>
                {product.product_name}
              </option>
            ))}
          </select>
          {errors.product && (
            <p className="text-red-500 text-sm">{errors.product}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="card bg-white shadow-lg rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Upload Product Images</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
            id="imageUpload"
          />
          <label
            htmlFor="imageUpload"
            className="btn btn-primary flex items-center"
          >
            <MdOutlineAddAPhoto className="mr-2" /> Add Images
          </label>
          {errors.images && (
            <p className="text-red-500 text-sm mt-2">{errors.images}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative w-24 h-24 border rounded">
                <img
                  src={image.preview}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-primary px-6 py-3" onClick={handleSubmit}>
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
