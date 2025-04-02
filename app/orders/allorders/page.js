"use client";
import React, { useEffect, useState, useRef } from "react";
import interceptor from "@/app/utils/interceptor";
import { Toaster, toast } from "react-hot-toast";
import Pagination from "../../components/Pagination";
import { FaEllipsisV } from "react-icons/fa";
import { FiEdit, FiTrash2, FiEye, FiShoppingCart } from "react-icons/fi";
import AssignOrderPopup from "../../components/orders/AssignOrderPopup";

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [showPopup, setShowPopup] = useState({ tog: false, orderId: "" });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });

  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        const response = await interceptor.get("/orders/order");
        if (isMounted) {
          setOrders(response.data.data);
          setPagination((prev) => ({
            ...prev,
            totalPages: Math.ceil(response.data.total / pagination.limit),
          }));
        }
      } catch (error) {
        toast.error("Failed to fetch orders.");
      }
    };
    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, [pagination.currentPage, pagination.limit]);

  const handlePageChange = (selectedPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: selectedPage + 1,
    }));
  };

  const handleToggleDropdown = (e, orderId) => {
    e.stopPropagation();
    if (dropdownOpen === orderId) {
      setDropdownOpen(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
      });
      setDropdownOpen(orderId);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAction = (action, orderId) => {
    console.log("Executing action:", action, "for order ID:", orderId);

    setDropdownOpen(null);
    // Placeholder for action handling
    // toast.success(`${action} action for order ID: ${orderId}`);
    if (action === "Assign") {
      setShowPopup({ tog: true, orderId });
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-6 relative">
      <Toaster />

      {showPopup.tog && (
        <AssignOrderPopup
          orderId={showPopup.orderId}
          setShowPopup={setShowPopup}
        />
      )}
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="py-3 px-6">{order.orderId}</td>
                  <td className="py-3 px-6">
                    <span className="px-3 py-1 rounded-full text-white text-sm bg-blue-500">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="p-2 rounded-full hover:bg-gray-200"
                      onClick={(e) => handleToggleDropdown(e, order._id)}
                    >
                      <FaEllipsisV />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <div>Data not found</div>
            )}
          </tbody>
        </table>
      </div>

      {/* Fixed positioned dropdown */}
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="fixed bg-white shadow-md rounded-lg z-50"
          style={{
            width: "12rem",
            left: `${Math.min(
              dropdownPosition.left,
              window.innerWidth - 192
            )}px`,
            top: `${dropdownPosition.top}px`,
          }}
        >
          <button
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => handleAction("View", dropdownOpen)}
          >
            <FiEye className="mr-2" /> View
          </button>
          <button
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => handleAction("Edit", dropdownOpen)}
          >
            <FiEdit className="mr-2" /> Edit
          </button>
          <button
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => handleAction("Assign", dropdownOpen)}
          >
            <FiShoppingCart className="mr-2" /> Assign
          </button>
          <button
            className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
            onClick={() => handleAction("Delete", dropdownOpen)}
          >
            <FiTrash2 className="mr-2" /> Delete
          </button>
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

export default AllOrders;
