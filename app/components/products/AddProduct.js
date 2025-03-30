"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import close from "../../../public/assets/close.svg";
import interceptor from "../../utils/interceptor";
import toast from "react-hot-toast";

export default function UpdateCategory({ setShowPopup }) {
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [productPhoto, setProductPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [shape, setShape] = useState("");
  const [size, setSize] = useState("");
  const [thickness, setThickness] = useState("");

  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await interceptor.get("/products/category");
        setCategoryData(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
      }
    })();
  }, []);

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleSkuChange = (e) => {
    setSku(e.target.value);
  };

  const handleProductCategoryChange = (e) => {
    setProductCategory(e.target.value);
  };

  const handleMrpChange = (e) => {
    setMrp(e.target.value);
  };

  const handleSellingPriceChange = (e) => {
    setSellingPrice(e.target.value);
  };

  const handleProductPhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleShapeChange = (e) => {
    setShape(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const handleThicknessChange = (e) => {
    setThickness(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      !productName ||
      !sku ||
      !productCategory ||
      !mrp ||
      !sellingPrice ||
      !shape ||
      !size ||
      !thickness
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    if (mrp < 0 || sellingPrice < 0) {
      toast.error("MRP and Selling Price cannot be negative.");
      return;
    }
  
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("sku", sku);
    formData.append("productCategory", productCategory);
    formData.append("mrp", mrp);
    formData.append("sellingPrice", sellingPrice);
    if (productPhoto) {
      formData.append("productPhoto", productPhoto);
    }
    formData.append("shape", shape);
    formData.append("size", size);
    formData.append("thickness", thickness);
  
    try {
      const response = await interceptor.post("/products/products", formData);
      console.log(response.data);
      if (response.data.status === "success") {
        toast.success("Product added successfully");
        setShowPopup(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add product. Please try again.");
    }
  };
  

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="w-full flex justify-end">
        <Image
          src={close}
          alt="close"
          width={20}
          height={20}
          onClick={() => setShowPopup(false)}
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>

        <div>
          <input
            type="text"
            placeholder="Product Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={productName}
            onChange={handleProductNameChange}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="SKU"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sku}
            onChange={handleSkuChange}
          />
        </div>

        <div>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={productCategory}
            onChange={handleProductCategoryChange}
          >
            <option value="">Select Category</option>
            {categoryData &&
              categoryData.map((category, index) => (
                <option key={index} value={category._id}>
                  {category.category_name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <input
            type="number"
            placeholder="MRP"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={mrp}
            onChange={handleMrpChange}
          />
          <input
            type="number"
            placeholder="Selling Price"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sellingPrice}
            onChange={handleSellingPriceChange}
          />
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleProductPhotoChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewUrl && (
            <div className="mt-4">
              <Image
                src={previewUrl}
                alt="Preview"
                width={50}
                height={50}
                className="rounded-md"
              />
              <button
                type="button"
                onClick={() => setPreviewUrl("")}
                className="mt-2 px-3 py-1 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={shape}
            onChange={handleShapeChange}
          >
            <option value="">Select Shape</option>
            <option value="square">Square</option>
            <option value="circle">Circle</option>
            <option value="butterfly">Butterfly</option>
            <option value="eye">Eye</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <select
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={size}
            onChange={handleSizeChange}
          >
            <option value="">Select Size</option>
            <option value="6x18">6x18</option>
            <option value="121x8">121x8</option>
            <option value="16x12">16x12</option>
            <option value="11x11">11x11</option>
          </select>

          <select
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={thickness}
            onChange={handleThicknessChange}
          >
            <option value="">Select Thickness</option>
            <option value="3mm">3mm</option>
            <option value="5mm">5mm</option>
            <option value="7mm">7mm</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
