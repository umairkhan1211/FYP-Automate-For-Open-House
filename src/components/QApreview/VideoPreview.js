import Link from "next/link";
import React, { useState } from "react";
import QAChecklist from "../../components/QAChecklist/QAChecklist";

export default function VideoPreview() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleRejectClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rejection Reason:", reason);
    setIsModalOpen(false);
  };

  const videoUrl = "https://www.youtube.com/watch?v=example";
  const thumbnailUrl = "https://via.placeholder.com/150";

  return (
    <div className="p-6">
       <div className="my-2  mx-44">
          <Link href="/QAportal/Review">
            <button
              className={
                "border-2 rounded-lg text-md font-semibold py-1 px-4 border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-[#0069D9]"
              }
            >
              Back
            </button>
          </Link>
        </div>
      <div className="flex flex-col md:flex-row p-2">
        <div className="flex-1 max-w-lg mx-auto p-6 border-2 border-[#0069D9] rounded-lg bg-white">
          <div>
            <h2 className="text-lg font-semibold mb-4">Demo Video</h2>
            <label className="block font-semibold mb-2">Video URL:</label>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {videoUrl}
            </a>
          </div>
          <div className="p-6 bg-white border-2 border-[#0069D9] rounded mt-4">
            <h2 className="text-lg font-semibold mb-4">Banner Image</h2>
            <label className="block font-semibold mb-2">Thumbnail:</label>
            <img
              src={thumbnailUrl}
              alt="Thumbnail"
              className="w-[150px] h-[150px] rounded"
            />
          </div>
        </div>
        <div>
          <QAChecklist type="video" />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Video Rejection</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter reason"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
