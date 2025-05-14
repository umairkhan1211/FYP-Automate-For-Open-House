// components/SpervisorPreview/CVPreview.js
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

function CVPreview({
  cvFilePath,
  rollNumber,
  supervisorId,
  studentId,
  supervisorRole,
}) {


  console.log("Props received in CVPreview:", { studentId, supervisorId, rollNumber , cvFilePath });

  const [cvUrl, setCvUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (cvFilePath) {
      const relativePath = cvFilePath.replace(/^public/, "");
      const finalUrl = relativePath.startsWith("/")
        ? relativePath
        : `/${relativePath}`;
      setCvUrl(finalUrl);
    }
    setIsLoading(false);
  }, [cvFilePath]);

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // 1. Send rejection notification
    await axios.post("/api/Notification/SupervisorNotification", {
      studentId,
      supervisorRole,
      supervisorId,
      rollNumber,
      type: "cv",
      optionalMessage: reason,
    });
    
    // 2. Remove CV path from Upload model
    await axios.put("/api/SupervisorDelete/RemoveCV", {
      studentId,
    });

    console.log("Notification sent and CV path removed successfully");

    window.location.reload();
  } catch (error) {
    console.error("Error submitting rejection:", error);
  }

  setIsModalOpen(false);
  setReason("");
};


  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h2 className="font-extrabold text-base text-[#0069D9] text-center p-4">
        CV PREVIEW
      </h2>

      {cvUrl ? (
        <div className="block">
          <Image
            src={cvUrl}
            alt="CV Preview"
            width={450}
            height={450}
            className="shadow-md mx-auto"
          />

          <div className="flex justify-end p-6 space-x-4 mx-auto w-1/2">
            <button
              className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600"
              title="Approve"
            >
              ✔️
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
              title="Reject"
            >
              ❌
            </button>
          </div>
        </div>
      ) : (
        <p className="text-red-500 text-center font-bold text-lg">
          No CV uploaded
        </p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            <div className="flex space-x-2">
              <div className="">
                <p className="mb-2 text-[#0069D9] bg-gray-200 rounded-full p-2 text-sm font-bold">
                  CV
                </p>
              </div>
              <div>
                <p className="mb-4 text-[#0069D9] bg-gray-200 rounded-full p-2 text-sm font-bold capitalize">
                  {rollNumber}
                </p>
              </div>
            </div>
            <h2 className="text-lg font-bold mb-4 text-[#0069D9]">
              Reason for Rejection
            </h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason..."
                className="w-full border border-gray-300 rounded p-2 mb-4 text-black"
                rows={4}
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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

export default CVPreview;
