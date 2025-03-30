"use client";

import { useRouter } from "next/navigation";

const Popup = ({ isOpen, onClose, onConfirm, title, message, leadId }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm(); // Await the confirmation action
    } catch (error) {
      console.error("Confirmation failed:", error); // Log errors
      return; // Prevent closing on failure
    }
    onClose(); // Close the popup after successful confirmation
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[43]"
      onClick={onClose} // Close on background click
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} // Stop clicks inside modal from propagating
      >
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose} // Close on Cancel
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={handleConfirm} // Handle Confirm properly
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
