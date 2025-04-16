import React, { useState, useEffect } from "react";

function EditUser({ show, handleClose, user, handleUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    rollNumber: "", // Add rollNumber to formData
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        department: user.department || "", // Ensure department is set
        rollNumber: user.rollNumber || "", // Ensure rollNumber is set
      });
    }
  }, [user]);

  if (!show) return null;



  // Define available departments
  const departments = ["Computer Science", "Software Engineering", "Civil Engineering", "Mechanical Engineering", "Business Administration"]; // Example departments

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-extrabold mb-4  dark:text-white text-[#0069D9]">Edit</h2>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="leading-tight border-2 border-[#0069D9] rounded w-full p-2 mb-3 dark:bg-slate-800 dark:text-white dark:border-white"
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="leading-tight border-2 border-[#0069D9] rounded w-full p-2 mb-3 dark:bg-slate-800 dark:text-white dark:border-white"
          placeholder="Email"
        />
        
        {/* Conditionally render Roll Number field for Students */}
        {user.role === "student" && (
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            className="leading-tight border-2 border-[#0069D9] rounded w-full p-2 mb-3 dark:bg-slate-800 dark:text-white dark:border-white"
            placeholder="Roll Number"
          />
        )}

        {/* Conditionally render Department dropdown for non-Directors */}
        {user.role !== "director" && (
          <select
            name="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="leading-tight border-2 border-[#0069D9] rounded w-full p-2 mb-3 dark:bg-slate-800 dark:text-white dark:border-white"
          >
            <option value="" disabled>Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        )}

        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-md mr-2 hover:bg-gray-500"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 border-2 border-[#0069D9] text-white font-bold bg-[#0069D9] rounded-md p-2 dark:bg-blue-600 dark:border-white hover:bg-blue-600 hover:text-white hover:border-blue-600"
            onClick={() => handleUpdate(user._id, formData)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
