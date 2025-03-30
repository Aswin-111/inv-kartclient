import React, { useState } from "react";

const PopupForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    dueDate: "",
    activityType: "Call", // Default to Call
    priority: "Medium", // Default to Medium
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Task</h2>
          <button
            onClick={onClose}
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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Task Name
            </label>
            <input
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Activity Type
            </label>
            <div className="flex space-x-4 mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="activityType"
                  value="Whatsapp"
                  checked={formData.activityType === "Whatsapp"}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Whatsapp</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="activityType"
                  value="Call"
                  checked={formData.activityType === "Call"}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Call</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="activityType"
                  value="Meeting"
                  checked={formData.activityType === "Meeting"}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Meeting</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
