import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

function CVPreview({
  cvFilePath,
  rollNumber,
  studentId,
  supervisorId,
  supervisorRole,
}) {
  console.log("Props received in CVPreview:", {
    studentId,
    supervisorId,
    supervisorRole,
    rollNumber,
    cvFilePath,
  });

  const [cvUrl, setCvUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isApproved, setIsApproved] = useState(false); // New state for tracking approval

  useEffect(() => {
    if (!studentId || !supervisorId) return;
    // Fetch current CV review status from backend
    const fetchCvStatus = async () => {
      try {
        const response = await axios.get("/api/Status/SupCvSubmitStatus", {
          params: {
            studentId,
            supervisorId,
          },
        });

        if (response.data?.supervisorCvReview === "approved") {
          setIsApproved(true);
        }
      } catch (error) {
        console.error("Error fetching CV status:", error);
      }
    };

    fetchCvStatus();
  }, [studentId, supervisorId]);

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

  // Handle approval or rejection
  const handleApproval = async () => {
    try {
      // 1. Update the supervisorCvReview status to 'Approved'
      const response = await axios.put("/api/Status/SupCvReview", {
        studentId,
        supervisorId,
        status: "approved",
      });

      if (response?.supervisorCvReview === "approved") {
        setIsApproved(true);
      }

      console.log("Supervisor CV status updated to Approved");
      setIsApproved(true); // Set to true when approved
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  const handleRejection = async (e) => {
    e.preventDefault();

    try {
      // 1. Send rejection notification
      await axios.post("/api/Notification/SupervisorNotification", {
        studentId,
        supervisorId,
        userRole: supervisorRole, // ✅ This was missing!
        rollNumber,
        type: "cv",
        optionalMessage: reason,
      });

      // 2. Remove CV path from Upload model
      await axios.put("/api/SupervisorDelete/RemoveCV", {
        studentId,
      });

      // 3. Update the supervisorCvReview status to 'Rejected'
      await axios.put("/api/Status/SupCvReview", {
        studentId,
        supervisorId,
        status: "rejected",
      });

      console.log(
        "Notification sent, CV path removed, and status updated to Rejected"
      );

      window.location.reload(); // Refresh the page after rejection
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
      <h2 className="text-[#0069D9] text-center text-lg font-extrabold mb-2">
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

          {!isApproved && (
            <div className="flex justify-end p-6 space-x-4 mx-auto w-1/2">
              <button
                onClick={handleApproval}
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
          )}

          {isApproved && (
            <div className="text-green-500 text-center font-bold mt-4 text-lg">
              ✔️ Approved
            </div>
          )}
        </div>
      ) : (
        <div className="fixed  inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="">
              <iframe
                src="https://lottie.host/embed/0b07dc83-ff2e-48ef-a6d7-fd9ef80ee558/OI4XmEWxva.lottie"
                className="w-[300px] h-[300px] opacity-0 animate-fade-in mx-auto"
              ></iframe>
            </div>
            <p className="text-red-500 text-center font-bold text-base capitalize">
              No CV uploaded
            </p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-200 p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            <div className="flex space-x-2">
              <div className="">
                <p className="mb-2 text-[#0069D9] bg-gray-300 rounded-full p-2 text-sm font-bold">
                  CV
                </p>
              </div>
              <div>
                <p className="mb-4 text-[#0069D9] bg-gray-300 rounded-full p-2 text-sm font-bold capitalize">
                  {rollNumber}
                </p>
              </div>
            </div>
            <h2 className="text-lg font-extrabold mb-4 text-[#0069D9]">
              Reason
            </h2>
            <form onSubmit={handleRejection}>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason..."
                className="w-full border bg-gray-100 border-gray-500 rounded p-2 mb-4 text-black"
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
