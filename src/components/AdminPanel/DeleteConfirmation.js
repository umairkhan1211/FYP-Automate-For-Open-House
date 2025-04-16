import React from "react";

function DeleteConfirmation({ show, handleClose, handleConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-extrabold mb-4  dark:text-white text-[#0069D9]">Delete</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this record? This action cannot be undone.
        </p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-md mr-2 hover:bg-gray-500"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
