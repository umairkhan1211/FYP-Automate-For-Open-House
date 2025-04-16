import Image from "next/image";
import React, { useEffect, useState } from "react";

const Sidebar = ({
  setSelectedOption,
  selectedOption,
  darkMode,
  isOpen,
  toggleSidebar,
}) => {
  // Ensure "AddStudent" is selected by default on page load
  useEffect(() => {
    if (!selectedOption) {
      setSelectedOption("AddStudent");
    }
  }, [selectedOption, setSelectedOption]);

  return (
    <div
      className={`h-full left-0 top-0 px-4 fixed  border-r-2 ${
        isOpen ? "border-[#0069D9]" : "border-transparent"
      } dark:border-white
 transition-all z-50 flex flex-col  duration-300 ${
   isOpen ? "w-64" : "w-20  items-center"
 }
      ${darkMode ? "bg-slate-800 text-white" : "bg-[#0069D9] text-white"}`}
    >
      <div
        className={`flex items-center py-3 border-b-2 border-white w-full ${
          isOpen ? "justify-start space-x-4" : "items-center"
        }`}
      >
        <Image alt="QAforfyp" src="/QAforfyp.png" width={56} height={56} />
        <h1
          className={`text-xl font-bold transition-all duration-300 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          ADMIN PANEL
        </h1>
      </div>

      <ul className="flex flex-col flex-1 mt-5 text-xl  space-y-1 font-medium">
        {[
          {
            id: "Statistics",
            label: "Statistics",
            icon: "bi-bar-chart-fill",
            
          },
          {
            id: "AddStudent",
            label: "Add Student",
            icon: "bi-person-fill-add",
          },
          {
            id: "AddSupervisor",
            label: "Add Supervisor",
            icon: "bi-person-plus-fill",
          },
          { id: "AddQA", label: "Add QA Member", icon: "bi-person-fill-gear" },
          { id: "AddHOD", label: "Add HOD", icon: "bi-person-fill-check" },
          {
            id: "AddDirector",
            label: "Add Director",
            icon: "bi-person-lines-fill",
          },
          {
            id: "RecordEntries",
            label: "Record Entries",
            
            icon: "bi-database-fill-gear",
          },
        ].map((item) => (
          <li
            key={item.id}
            onClick={() => setSelectedOption(item.id)}
            className={` flex items-center rounded-md py-2 px-4 space-x-5 cursor-pointer duration-200 
              ${
                selectedOption === item.id
                  ? darkMode
                    ? "bg-[#0069D9] text-white"
                    : "bg-white text-[#0069D9] "
                  : "hover:bg-white hover:text-[#0069D9] "
              }`}
          >
            <i className={`bi ${item.icon} text-2xl`}></i>
            {isOpen && <span className="md:inline text-lg  ">{item.label}</span>}
          </li>
        ))}
      </ul>

      <button
        onClick={toggleSidebar}
        className="m-2 flex items-center justify-center rounded-md text-white bg-blue-400 p-3 text-2xl dark:bg-[#0069D9] dark:text-white  duration-300 hover:text-[#0069D9]  hover:bg-white "
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-double-left "
            viewBox="0 0 16 16"
          >
            <path
              fillrule="evenodd"
              d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
            />
            <path
              fillrule="evenodd"
              d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-double-right"
            viewBox="0 0 16 16"
          >
            <path
              fillrule="evenodd"
              d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"
            />
            <path
              fillrule="evenodd"
              d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Sidebar;
