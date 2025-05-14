import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DeleteConfirmation from "../../components/AdminPanel/DeleteConfirmation";
import EditUser from "../../components/AdminPanel/EditUser";

function UserTable({ role, department, entriesPerPage }) {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Open Modals
  const openDeleteModal = (id) => {
    setSelectedUserId(id);
    setShowDeleteModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Close Modals
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUserId(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        let url = `/api/FetchRecords/Users?role=${role}`;
        if (department && department !== "All") {
          url += `&department=${department}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        setTableData([...data]); // Update the state with fetched data
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [role, department]);

  const getShortDept = (dept) => {
    const map = {
      "Computer Science": "CS",
      "Software Engineering": "SE",
      "Civil Engineering": "CE",
      "Mechanical Engineering": "ME",
      "Business Administration": "BA",
    };
    return map[dept] || dept;
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!selectedUserId) return;
    try {
      const response = await fetch(
        `/api/FetchRecords/Users?id=${selectedUserId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setTableData(tableData.filter((user) => user._id !== selectedUserId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      closeDeleteModal();
    }
  };

  // Handle Update
  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await fetch(`/api/FetchRecords/Users?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setTableData(
          tableData.map((user) => (user._id === id ? updatedUser : user))
        );
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      closeEditModal();
    }
  };

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(tableData.length / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = tableData.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-xl bg-[#E5E7EB] p-5 dark:bg-slate-800 dark:text-white transition-all duration-300"
    >
      {loading ? (
        <div className="text-center text-base font-semibold text-[#0069D9] dark:text-white">
          Loading {role} records... Please wait.
        </div>
      ) : tableData.length === 0 ? (
        <div className="text-center text-base font-semibold text-[#0069D9] dark:text-white">
          No Records Found
        </div>
      ) : (
        <>
          <motion.table
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-w-full border-collapse rounded-lg"
          >
            <thead>
              <tr className="text-sm md:text-base font-semibold text-center bg-[#0069D9] text-white dark:bg-white dark:text-[#0069D9]">
                <th className="px-4 py-2 w-[5%]">Id</th>
                <th className="px-4 py-2 w-[15%]">Name</th>
                <th className="px-4 py-2 w-[18%]">Email</th>
                {role === "student" && (
                  <th className="px-4 py-2 w-[15%]">Roll No</th>
                )}
                {role === "student" && (
                  <th className="px-4 py-2 w-[10%]">Supervisor</th>
                )}
                {role === "student" && (
                  <th className="px-4 py-2 w-[20%]">Project Title</th>
                )}
                {role !== "director" && (
                  <th className="px-4 py-2 w-[8%]">Department</th>
                )}
                <th className="px-4 py-2 w-[10%]">Edit</th>
                <th className="px-4 py-2 w-[10%]">Delete</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b text-[#0069D9] dark:text-white border-slate-300 text-sm md:text-base text-center"
                >
                  <td className="px-4 py-3 font-medium">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 font-medium">{item.email}</td>

                  {role === "student" && (
                    <td className="px-4 py-3 font-medium">{item.rollNumber}</td>
                  )}
                  {role === "student" && (
                    <td className="px-4 py-3 font-medium">
                      {item.supervisor || "N/A"}
                    </td>
                  )}
                  {role === "student" && (
                    <td className="px-4 py-3 font-medium">
                      {item.projectTitle || "N/A"}
                    </td>
                  )}

                  {role !== "director" && (
                    <td className="px-4 py-3 font-medium">
                      {getShortDept(item.department)}
                    </td>
                  )}

                  <td
                    className="px-4 py-3 font-medium text-blue-500 cursor-pointer hover:underline"
                    onClick={() => openEditModal(item)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </td>
                  <td
                    className="px-4 py-3 font-medium text-red-500 cursor-pointer hover:underline"
                    onClick={() => openDeleteModal(item._id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-base font-semibold border-2 hover:border-[#0069D9] hover:text-[#0069D9] 
                border-[#0069D9] text-white bg-[#0069D9] dark:text-[#0069D9] dark:bg-white dark:border-white rounded-lg 
                ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed hover:text-white"
                    : "hover:bg-white dark:hover:bg-white dark:border-2 dark:border-[#0069D9]"
                }`}
            >
              Previous
            </button>

            <span className="font-semibold text-xs text-[#0069D9] dark:text-white">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-base font-semibold border-2 hover:border-[#0069D9] hover:text-[#0069D9] 
                border-[#0069D9] text-white bg-[#0069D9] dark:text-[#0069D9] dark:bg-white dark:border-white rounded-lg 
                ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed hover:text-white"
                    : "hover:bg-white dark:hover:bg-white dark:border-2 dark:border-[#0069D9]"
                }`}
            >
              Next
            </button>
          </div>
        </>
      )}
      <DeleteConfirmation
        show={showDeleteModal}
        handleClose={closeDeleteModal}
        handleConfirm={handleDelete}
      />
      <EditUser
        show={showEditModal}
        handleClose={closeEditModal}
        user={selectedUser}
        handleUpdate={handleUpdate}
      />
    </motion.div>
  );
}

export default UserTable;
