import React, { useEffect, useState } from "react";
import UserTable from "../../components/AdminPanel/UserTable";

const departmentMapping = {
  All: "All",
  "Computer Science": "CS",
  "Software Engineering": "SE",
  "Civil Engineering": "CE",
  "Mechanical Engineering": "ME",
  "Business Administration": "BA",
};

function RecordEntries() {
  const [activeRole, setActiveRole] = useState("student");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [selectedDepartment, setSelectedDepartment] = useState("All"); // Default department
  const departments = Object.keys(departmentMapping); // Get full department names

  // Reset selectedDepartment when activeRole changes
  useEffect(() => {
    setSelectedDepartment("All");
  }, [activeRole]);

  return (
    <div className="p-5 h-full flex flex-col w-full">
      {/* Navigation Tabs */}
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <ul className="flex space-x-2 overflow-x-auto p-2 font-bold dark:bg-slate-800">
          {["student", "supervisor", "qa", "hod", "director"].map((role) => (
            <li key={role} className="list-none">
              <button
                className={`px-2 py-2 w-30 text-center rounded-lg transition-all duration-300 ${
                  activeRole === role
                    ? "bg-[#0069D9] text-white dark:bg-white dark:text-[#0069D9]"
                    : "bg-[#E5E7EB] dark:bg-gray-700 text-[#0069D9] dark:text-white"
                }`}
                onClick={() => setActiveRole(role)}
              >
                {role.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>

        {/* Entries Per Page and Department Selection - Aligned on the Right */}
        <div className="flex items-center space-x-4">
          {/* Entries Per Page Selection */}

          {/* Department Selection - Dropdown */}
          {activeRole !== "director" && (
            <select
              className="px-2 py-2 border-2 rounded-lg font-bold dark:bg-slate-800 bg-[#E5E7EB] dark:border-white dark:text-white text-[#0069D9] border-[#0069D9]"
              value={selectedDepartment}
              onChange={(e) => {
                console.log("Selected Department:", e.target.value); // Debug log
                setSelectedDepartment(e.target.value);
              }}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {departmentMapping[dept]} {/* Display abbreviated name */}
                </option>
              ))}
            </select>
          )}
          <select
            className="px-2 py-2 border-2 rounded-lg font-bold dark:bg-slate-800 bg-[#E5E7EB] dark:border-white dark:text-white text-[#0069D9] border-[#0069D9]"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          >
            {[5, 7, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-4 rounded-lg dark:bg-slate-800 w-full">
        <UserTable
          role={activeRole}
          department={selectedDepartment}
          entriesPerPage={entriesPerPage}
        />
      </div>
    </div>
  );
}

export default RecordEntries;
