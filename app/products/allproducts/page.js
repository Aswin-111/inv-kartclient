"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import AddProduct from "../../components/products/AddProduct";
import interceptor from "@/app/utils/interceptor";
import { Toaster } from "react-hot-toast";
import Pagination from "../../components/Pagination";
import threedots from "../../../public/menu.png";

function Products() {
  const [productsData, setProductsData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    limit: 10,
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await interceptor.get("/products/products", {
        params: { page: pagination.currentPage + 1, limit: pagination.limit },
      });
      setProductsData(response.data.data);
      setPagination({
        ...pagination,
        totalPages: Math.ceil(
          response.data.pagination.total / pagination.limit
        ),
      });
    };
    fetchProducts();
  }, [pagination.currentPage, pagination.limit, showPopup]);

  const handlePageChange = (selectedPage) => {
    setPagination({ ...pagination, currentPage: selectedPage });
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product List</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={() => setShowPopup(true)}
        >
          + Add Product
        </button>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Image</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {productsData.isArray() && productsData.length > 0 ? (
              productsData.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{product.product_name}</td>
                  <td className="p-3">${product.price}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        product.status === "Available"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <img
                      src={`http://localhost:7500/products/${product.file_name}`}
                      alt="product"
                      className="w-12 h-12 rounded-lg shadow-sm"
                    />
                  </td>
                  <td className="p-3">
                    <Image
                      src={threedots}
                      alt="Menu"
                      width={20}
                      height={20}
                      className="cursor-pointer"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <div>Records not found!</div>
            )}
          </tbody>
        </table>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <AddProduct setShowPopup={setShowPopup} />
        </div>
      )}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
export default Products;
