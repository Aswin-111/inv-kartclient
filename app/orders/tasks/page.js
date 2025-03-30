"use client";
import React, { useState, useCallback } from "react";

const TaskTablePage = () => {
  const [tasks, setTasks] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState(null);
  const [newPriority, setNewPriority] = useState("Medium");
  const [newActivityType, setNewActivityType] = useState("Call");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Helper function to format date (simplified for JavaScript)
  const formatDate = (date) => {
    if (!date) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Add a new task
  const addTask = useCallback(() => {
    if (newTaskTitle.trim() !== "" && newDueDate) {
      const newTask = {
        id: crypto.randomUUID(),
        title: newTaskTitle,
        description: newTaskDescription,
        dueDate: newDueDate,
        completed: false,
        priority: newPriority,
        activityType: newActivityType,
      };
      setTasks([...tasks, newTask]);
      setIsDialogOpen(false);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewDueDate(null);
      setNewPriority("Medium");
      setNewActivityType("Call");
    }
  }, [
    newTaskTitle,
    newTaskDescription,
    newDueDate,
    newPriority,
    newActivityType,
    tasks,
  ]);

  // Toggle task completion status
  const toggleComplete = useCallback(
    (id) => {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    },
    [tasks]
  );

  // Delete a task
  const deleteTask = useCallback(
    (id) => {
      setTasks(tasks.filter((task) => task.id !== id));
    },
    [tasks]
  );

  const getStatus = (task) => {
    if (task.completed) {
      return "Completed";
    }
    if (task.dueDate && task.dueDate < new Date()) {
      return "Overdue";
    }
    return "Scheduled";
  };

  // Handle date change (simplified for JavaScript)
  const handleDateChange = (date) => {
    setNewDueDate(date);
    setIsCalendarOpen(false); // Close the calendar after selection
  };

  const filteredTasks = tasks.filter((task) => {
    const searchMatch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const statusMatch =
      filterStatus === "All" ||
      (filterStatus === "New" && !task.completed) ||
      (filterStatus === "Won" && task.completed);
    return searchMatch && statusMatch;
  });

  return (
    <div className="max-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex justify-between items-start mb-6 flex-col sm:flex-row gap-4">
          <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-0">
            <button
              onClick={() => setFilterStatus("All")}
              className={`px-4 py-2 rounded-md font-semibold ${
                filterStatus === "All"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("New")}
              className={`px-4 py-2 rounded-md font-semibold ${
                filterStatus === "New"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              New
            </button>
            <button
              onClick={() => setFilterStatus("Won")}
              className={`px-4 py-2 rounded-md font-semibold ${
                filterStatus === "Won"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Won
            </button>
            {/* Add Follow Up filter later */}
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => setIsDialogOpen(true)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-plus-circle w-5 h-5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
              + Add Lead
            </button>
          </div>
        </div>

        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            {" "}
            {/* Added overflow-y-auto */}
            <div className="bg-white text-gray-900 rounded-lg shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
              {" "}
              {/* Added max-h and overflow-y */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Task</h2>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x-circle w-6 h-6"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium block text-gray-700"
                  >
                    Task Name
                  </label>
                  <input
                    id="title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium block text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Task Description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="dueDate"
                    className="text-sm font-medium block text-gray-700"
                  >
                    Due Date
                  </label>
                  <div className="relative inline-block">
                    <button
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {newDueDate ? (
                        formatDate(newDueDate)
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </button>
                    {isCalendarOpen && (
                      <div className="absolute left-0 mt-2 w-auto bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <Calendar
                          mode="single"
                          selected={newDueDate}
                          onSelect={handleDateChange}
                          onMonthChange={() => {}}
                          className="rounded-md border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">
                    Activity Type
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="activity-whatsapp"
                        name="activityType"
                        value="Whatsapp"
                        checked={newActivityType === "Whatsapp"}
                        onChange={() => setNewActivityType("Whatsapp")}
                        className="border-gray-400 focus:ring-blue-500 h-4 w-4"
                      />
                      <label
                        htmlFor="activity-whatsapp"
                        className="text-gray-700"
                      >
                        Whatsapp
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="activity-call"
                        name="activityType"
                        value="Call"
                        checked={newActivityType === "Call"}
                        onChange={() => setNewActivityType("Call")}
                        className="border-gray-400 focus:ring-blue-500 h-4 w-4"
                      />
                      <label htmlFor="activity-call" className="text-gray-700">
                        Call
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="activity-meeting"
                        name="activityType"
                        value="Meeting"
                        checked={newActivityType === "Meeting"}
                        onChange={() => setNewActivityType("Meeting")}
                        className="border-gray-400 focus:ring-blue-500 h-4 w-4"
                      />
                      <label
                        htmlFor="activity-meeting"
                        className="text-gray-700"
                      >
                        Meeting
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block text-gray-700">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="notes"
                    className="text-sm font-medium block text-gray-700"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    placeholder="Additional notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-md border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
                  disabled={!newTaskTitle.trim() || !newDueDate}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-gray-200 mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-500">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Rating
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Test
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        task.completed
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {task.completed ? "Won" : "New"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className={
                        "rounded-full w-8 h-8 transition-colors " +
                        (task.completed
                          ? "text-green-500 hover:bg-green-500/20"
                          : "text-gray-400 hover:text-purple-500 hover:bg-purple-500/20")
                      }
                    >
                      {task.completed ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-check-circle w-5 h-5"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-circle w-5 h-5"
                        >
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full w-8 h-8"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-x-circle w-5 h-5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m15 9-6 6" />
                        <path d="m9 9 6 6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tasks.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            No tasks yet. Add some!
          </div>
        )}
      </div>
    </div>
  );
};

// Simplified Calendar component (for demonstration purposes)
const Calendar = ({ mode, selected, onSelect, onMonthChange, className }) => {
  const [month, setMonth] = useState(
    selected ? new Date(selected).getMonth() : new Date().getMonth()
  );
  const [year, setYear] = useState(
    selected ? new Date(selected).getFullYear() : new Date().getFullYear()
  );
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const today = new Date();

  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  };

  const handleDayClick = (day) => {
    const selectedDate = new Date(year, month, day);
    onSelect(selectedDate);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold">
          {getMonthName(month)} {year}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (month === 0) {
                setMonth(11);
                setYear(year - 1);
              } else {
                setMonth(month - 1);
              }
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            &lt;
          </button>
          <button
            onClick={() => {
              if (month === 11) {
                setMonth(0);
                setYear(year + 1);
              } else {
                setMonth(month + 1);
              }
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            &gt;
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={`dayname-${i}`}
          className="w-10 h-10 flex items-center justify-center text-gray-500 font-medium"
        >
          {dayNames[i]}
        </div>
      );
    }

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;
      const isSelected =
        selected &&
        selected.getDate() === day &&
        selected.getMonth() === month &&
        selected.getFullYear() === year;

      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          className={
            "w-10 h-10 rounded-full flex items-center justify-center " +
            (isToday
              ? "bg-blue-500 text-white"
              : isSelected
              ? "bg-purple-500 text-white"
              : "hover:bg-gray-100 text-gray-900")
          }
        >
          {day}
        </button>
      );
    }
    return <div className="grid grid-cols-7 gap-1">{days}</div>;
  };

  return (
    <div className={`p-2 rounded-md ${className}`}>
      {renderHeader()}
      {renderDays()}
    </div>
  );
};

export default TaskTablePage;
