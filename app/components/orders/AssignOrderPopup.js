"use client";
import { useEffect, useState } from "react";
import interceptor from "../../utils/interceptor";
import toast from "react-hot-toast";

export default function RoleAssignmentPopup({ setShowPopup, orderId }) {
  const [usersData, setUsersData] = useState([]);
  //   const [usersData, setUsersData] = useState(null);
  const [selectedRole, setSelectedRole] = useState("designer");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // replace with interceptor
        const response = await interceptor.get(
          `/orders/getalluserbyrole/${selectedRole}`
        );

        console.log(response.data.data);

        setUsersData(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleClick = async () => {
    try {
      console.log(selectedId, "selected id ");
      const response = await interceptor.post("/orders/assignorder", {
        userId: selectedId,
        orderId,
      });
      console.log(response.data);
      setShowPopup(false);
    } catch (error) {
      toast(error);
      console.error("Error assigning order:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96">
        {/* Role Selection Tabs - Centered */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 rounded-full p-1 flex gap-2">
            {["designer", "printer"].map((role) => (
              <button
                key={role}
                className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                  selectedRole === role
                    ? "bg-primary text-white shadow"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* User List Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="table w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-2">Name</th>

                <th className="py-2 text-center">Select</th>
              </tr>
            </thead>
            <tbody>
              {usersData
                .filter((user) => user.role === selectedRole)
                .map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2">{user.name}</td>
                    <td className="py-2 text-center">
                      <input
                        type="radio"
                        name="user"
                        className="radio"
                        checked={selectedUser === user.name}
                        onChange={() => {
                          setSelectedUser(user.name);
                          setSelectedId(user._id);
                          console.log(user._id);
                        }}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Assign Button */}
        <button
          className="btn btn-primary w-full mt-4 text-lg font-semibold rounded-full"
          disabled={!selectedUser}
          onClick={() => {
            handleClick();
          }}
        >
          Assign
        </button>
      </div>
    </div>
  );
}
