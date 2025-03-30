"use client";
import React, { useEffect, useState, useRef } from "react";
import interceptor from "@/app/utils/interceptor";
import { Toaster, toast } from "react-hot-toast";
import Pagination from "../../components/Pagination";
import Popup from "../../components/orders/Tooltip";
import { useRouter } from "next/navigation";
import {
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiShoppingCart,
} from "react-icons/fi";

function AddLeadPopup({ isOpen, onClose, onLeadAdded, setShowAddLeadPopup }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    rating: "",
    status: "",
    note: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        phone: "",
        rating: "",
        status: "",
        note: "",
      });
      setErrors({});
    }
  }, [isOpen]);
 
  const validateForm = () => {
    const formErrors = {};
    if (!formData.name.trim()) formErrors.name = "Full name is required";
    if (!formData.phone.trim()) formErrors.phone = "Phone number is required";
    if (!formData.rating.trim()) formErrors.rating = "Rating is required";
    if (!formData.status.trim()) formErrors.status = "Status is required";
    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await interceptor.post("/orders/leads", formData);
        // onLeadAdded(response.data);
        toast.success("Lead added successfully!");

        setShowAddLeadPopup(false);
      } catch (error) {
        console.log(error);
        setShowAddLeadPopup(false);

        toast.error("Failed to add lead.");
      }
    } else {
      setErrors(formErrors);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Add New Lead</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          <input
            name="phone"
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Rating</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
          </select>
          {errors.rating && (
            <p className="text-red-500 text-sm">{errors.rating}</p>
          )}
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Status</option>
            <option value="New">New</option>
            <option value="Won">Won</option>
            <option value="Follow Up">Follow Up</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status}</p>
          )}
          <textarea
            name="note"
            rows={4}
            placeholder="Note"
            value={formData.note}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

function Leads() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const router = useRouter();

  // State for the existing popup (confirmations, etc.):
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({
    title: "",
    message: "",
    action: () => {},
  });

  // State for the new AddLead popup:
  const [showAddLeadPopup, setShowAddLeadPopup] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchLeads = async () => {
      try {
        const params = {
          page: pagination.currentPage,
          limit: pagination.limit,
        };
        if (filter !== "All") {
          params.status = filter;
        }
        const response = await interceptor.get("/orders/leads", { params });
        if (isMounted) {
          setLeads(response.data.leads);
          setPagination((prev) => ({
            ...prev,
            totalPages: Math.ceil(response.data.total / pagination.limit),
          }));
        }
      } catch (error) {
        toast.error("Failed to fetch leads.");
      }
    };
    fetchLeads();
    return () => {
      isMounted = false;
    };
  }, [filter, pagination.currentPage, pagination.limit, showAddLeadPopup]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scrolling when any popup is open
  useEffect(() => {
    if (showPopup || showAddLeadPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup, showAddLeadPopup]);

  const handlePageChange = (selectedPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: selectedPage + 1,
    }));
  };

  const handleToggleDropdown = (e, leadId) => {
    e.stopPropagation();
    if (dropdownOpen === leadId) {
      setDropdownOpen(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
      });
      setDropdownOpen(leadId);
    }
  };

  // Show confirmation popup for Edit/Delete/Order
  const handlePopupAction = (action, leadId) => {
    setDropdownOpen(null);
    setPopupContent({
      title: `${action} Lead`,
      message: `Are you sure you want to ${action.toLowerCase()} this lead?`,
      action: async () => {
        try {
          console.log("Executing action:", action, "for lead ID:", leadId);
          if (action === "Order") {
            router.push(`/orders/order-details/${leadId}`);
          } else {
            toast.success(`${action} action executed for lead ID: ${leadId}.`);
          }
        } catch (error) {
          toast.error("Action failed. Please try again.");
        }
      },
      leadId, // Pass the leadId
    });
    setShowPopup(true);
  };

  return (
    <div className="max-w-screen-lg mx-auto p-6 relative">
      <Toaster />
      {/* Background Overlay for the existing confirmation popup */}
      {showPopup && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPopup(false)}
        />
      )}
      {/* Confirmation Popup (for Edit/Delete/Order) */}
      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onConfirm={popupContent.action}
        title={popupContent.title}
        message={popupContent.message}
        leadId={popupContent.leadId}
      />
      {/* AddLeadPopup for adding a new lead */}
      <AddLeadPopup
        isOpen={showAddLeadPopup}
        setShowAddLeadPopup={setShowAddLeadPopup}
      />
      <div className="flex justify-between mb-4">
        <div className="space-x-2">
          {["All", "New", "Won", "Follow Up"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
                setFilter(status);
              }}
            >
              {status}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by name"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* Show the AddLeadPopup when clicked */}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          onClick={() => setShowAddLeadPopup(true)}
        >
          + Add Lead
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Rating</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads
              .filter((lead) =>
                (lead.name || "").toLowerCase().includes(search.toLowerCase())
              )
              .map((lead, index) => (
                <tr
                  key={lead._id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="py-3 px-6">{lead.name}</td>
                  <td className="py-3 px-6">{lead.phone}</td>
                  <td className="py-3 px-6">{lead.rating}</td>
                  <td className="py-3 px-6">
                    <span className="px-3 py-1 rounded-full text-white text-sm bg-blue-500">
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="p-2 rounded-full hover:bg-gray-200"
                      onClick={(e) => handleToggleDropdown(e, lead._id)}
                    >
                      <FiMoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
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
            onClick={() => handlePopupAction("Edit", dropdownOpen)}
          >
            <FiEdit className="mr-2" /> Edit
          </button>
          <button
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => handlePopupAction("Delete", dropdownOpen)}
          >
            <FiTrash2 className="mr-2" /> Delete
          </button>
          <button
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => handlePopupAction("Order", dropdownOpen)}
          >
            <FiShoppingCart className="mr-2" /> Order
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

export default Leads;
