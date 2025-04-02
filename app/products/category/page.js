"use client";

import React, { useEffect, useState } from "react";
import AddCategory from "../../components/products/AddCategory";
import interceptor from "@/app/utils/interceptor";
import { Toaster } from "react-hot-toast";
import Pagination from "../../components/Pagination";

function Category() {
  const [categoryData, setCategoryData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    limit: 10,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await interceptor.get("/products/category", {
          params: {
            page: pagination.currentPage + 1,
            limit: pagination.limit,
          },
        });
        setCategoryData(response.data.data);
        setPagination({
          ...pagination,
          totalPages: Math.ceil(
            response.data.pagination.total / pagination.limit
          ),
        });
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [pagination.currentPage, pagination.limit, showPopup]);

  const handlePageChange = (selectedPage) => {
    setPagination({ ...pagination, currentPage: selectedPage });
  };

  return (
    <div className="max-w-screen-lg mx-auto p-6">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md"
          onClick={() => setShowPopup(true)}
        >
          + Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-left">Status</th>{" "}
              {/* Added Status Column */}
              <th className="py-3 px-6 text-left">Action</th>{" "}
              {/* Added Action Column */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  Loading categories...
                </td>
              </tr>
            ) : (Array.isArray(categoryData) && categoryData.length > 0 ) ? (
              categoryData.map((category) => (
                <tr key={category._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-6">{category.category_name}</td>
                  <td className="py-3 px-6">
                    <img
                      src={`http://localhost:7500/category/${category.file_name}`}
                      alt="category"
                      width={40}
                      height={40}
                      className="rounded-md shadow"
                    />
                  </td>
                  <td className="py-3 px-6">
                    <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                      New
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <button className="text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {(pagination.totalPages && pagination.totalPages > 1) && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add New Category</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <AddCategory setShowPopup={setShowPopup} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;
