"use client";

import { useState } from "react";
import Image from "next/image";
import { XCircle } from "lucide-react";
import interceptor from "../../utils/interceptor";
import toast from "react-hot-toast";

export default function UpdateCategory({ setShowPopup }) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleNameChange = (e) => setCategoryName(e.target.value);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    if (selectedImage) {
      formData.append("categoryImage", selectedImage);
    }
    try {
      const response = await interceptor.post("/products/category", formData);
      if (response.data.status === "success") {
        toast.success("Category updated successfully");
        setShowPopup(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPopup(false)}
        >
          <XCircle size={24} />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Update Category
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Category Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={categoryName}
            onChange={handleNameChange}
          />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
            />
            {previewUrl && (
              <div className="mt-4 flex flex-col items-center">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={180}
                  height={180}
                  className="rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setPreviewUrl("")}
                  className="mt-2 text-sm text-red-600 bg-red-100 px-3 py-1 rounded-lg hover:bg-red-200"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Update Category
          </button>
        </form>
      </div>
    </div>
  );
}