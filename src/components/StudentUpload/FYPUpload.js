import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function FYPUpload({
  userId,
  rollNumber,
  projectTitle,
  isFypUploaded,
}) {
  const [fypDocument, setFypDocument] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!fypDocument) {
    toast.error("Please upload your FYP document first.");
    return;
  }

  const loadingToastId = toast.loading("Uploading...");

  const formData = new FormData();
  formData.append("fypDocument", fypDocument);
  formData.append("userId", userId);
  formData.append("rollNumber", rollNumber);
  formData.append("fileType", "fypDocument");

  try {
    // Step 1: Upload the FYP document
    const response = await fetch("/api/UploadFile/Upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("FYP document uploaded successfully!", { id: loadingToastId });
      setIsSubmitted(true);
      resetForm();

      // Step 2: Submit FYP status update
      const submitRes = await fetch("/api/Status/FYPSubmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: userId,
          rollNumber,
        }),
      });

      const submitData = await submitRes.json();

      if (!submitRes.ok) {
        throw new Error(submitData.message || "Failed to update FYP status");
      }

   
      setIsSubmitted(true);
      setUploadMessage("FYP document submitted successfully");

      // Step 3: Remove notification after successful submission
      try {
        await fetch("/api/SupervisorDelete/RemoveFypNotification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: userId, rollNumber }),
        });
      } catch (error) {
        console.error("Error removing notification:", error);
      }
    } else {
      toast.error(`Error: ${data.error}`, { id: loadingToastId });
    }
  } catch (error) {
    console.error("Error submitting FYP document:", error);
    toast.error("Something went wrong.", { id: loadingToastId });
  }
};

const resetForm = () => {
  setFypDocument(null);
  setIsSubmitted(false);
};

const isFormValid = () => {
  return fypDocument;
};


  return (
    <div className="p-16 text-left">
      <div className="max-w-2xl mx-auto p-6 border-2 border-[#0069D9] rounded">
        <h2 className="text-xl font-bold mb-4">{projectTitle}</h2>
        {isFypUploaded ? (
          <div className="text-green-600 font-semibold text-center">
            Congratulations, Already FYP Document Uploaded by your Group Member
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-[#0069D9]">
            <div className="space-y-2">
              <label className="block">
                <strong>FYP Document (.docx):</strong>
              </label>
              <input
                type="file"
                accept=".docx"
                onChange={(e) => {
                  setFypDocument(e.target.files[0]);
                  toast.success("File selected successfully!");
                }}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={isFypUploaded} // Disable if already uploaded
              />
            </div>
            <div className="flex justify-end space-x-2 ">
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!isFormValid() || isSubmitted || isFypUploaded} // Disable if already uploaded
                >
                  Submit
                </button>
              </div>
              <div>
                <Link href="/studentportal">
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Back
                  </button>
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
