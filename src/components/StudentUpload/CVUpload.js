import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function CVUpload({ userId, rollNumber }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkCvUploadStatus = async () => {
      if (!userId) return;

      try {
        const response = await fetch(
          `/api/UploadFile/CvStatus?userId=${userId}`
        );
        const data = await response.json();
        setUploadMessage(data.message);
        setIsSubmitted(!!data.cvFilePath);
      } catch (error) {
        console.error("Error checking CV upload status:", error);
      }
    };

    checkCvUploadStatus();
  }, [userId]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Client-side validation
      const validTypes = ["image/jpeg", "image/jpg"];
      if (!validTypes.includes(selectedFile.type.toLowerCase())) {
        toast.error("Only JPG files are allowed");
        return;
      }
      setFile(selectedFile);
      toast.success("File selected successfully!");
    }
  };

  const handleUploadClick = (event) => {
    event.preventDefault();
    if (!isSubmitted) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a file first.");
      return;
    }

    if (!userId || !rollNumber) {
      toast.error("Missing userId or rollNumber.");
      return;
    }

    const loadingToastId = toast.loading("Validating CV...");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("cvFile", file);
      uploadFormData.append("userId", userId);
      uploadFormData.append("rollNumber", rollNumber);
      uploadFormData.append("fileType", "cv");

      const uploadRes = await fetch("/api/UploadFile/Upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.message || "File upload failed");
      }

      // Step 2: Submit CV status
      const submitRes = await fetch("/api/Status/CVSubmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: userId,
          rollNumber,
        }),
      });

      const submitData = await submitRes.json();

      if (!submitRes.ok) {
        throw new Error(submitData.message || "Failed to update CV status");
      }

    
      setIsSubmitted(true);
      setUploadMessage("CV submitted successfully");

      // 4. Success
      toast.success("CV uploaded successfully!", { id: loadingToastId });
      setIsSubmitted(true);
      setUploadMessage("CV submitted successfully");

      // 5. Optional: Remove notification
      try {
        await fetch("/api/SupervisorDelete/RemoveCvNotification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: userId, rollNumber }),
        });
      } catch (error) {
        console.error("Error removing notification:", error);
      }
    } catch (error) {
      toast.error(error.message, {
        id: loadingToastId,
        duration: 5000,
      });
      console.error("CV upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto mb-10 p-4 rounded-lg w-full">
      <h2 className="font-extrabold text-base text-[#0069D9] p-4 text-center">
        CV UPLOAD
      </h2>
      {uploadMessage && (
        <div className="text-center text-green-600 font-bold mb-4">
          {uploadMessage}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-xl bg-[#E5E7EB] p-5 dark:bg-slate-800 dark:text-white transition-all duration-300"
      >
        <motion.table className="min-w-full border-collapse rounded-lg">
          <thead>
            <tr className="text-sm md:text-base font-semibold text-center bg-[#0069D9] text-white dark:bg-white dark:text-[#0069D9]">
              <th className="px-4 py-3">CV</th>
              <th className="px-4 py-3">Upload Date</th>
              <th className="px-4 py-3">Expired Date</th>
              <th className="px-4 py-3">Upload</th>
              <th className="px-4 py-3">Submit</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-300 text-sm md:text-base text-center">
              <td className="px-4 py-3 font-medium">
                <i className="bi bi-file-earmark-fill text-[#0069D9] text-3xl bg-white rounded-full p-2"></i>
              </td>
              <td className="px-4 py-3 font-medium">N/A</td>
              <td className="px-4 py-3 font-medium">N/A</td>
              <td className="px-4 py-3 font-medium flex flex-col items-center justify-center">
                {isSubmitted ? (
                  <span className="text-green-600 font-bold text-center">
                    Submitted
                  </span>
                ) : (
                  <>
                    <button
                      onClick={handleUploadClick}
                      className={`p-2 rounded-full text-[#0069D9] hover:bg-gray-300 transition-all duration-200 ${
                        isSubmitted ? "cursor-not-allowed" : ""
                      }`}
                      disabled={isSubmitted}
                    >
                      <i className="bi bi-cloud-arrow-up-fill text-4xl"></i>
                    </button>
                    {file && (
                      <span className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {file.name}
                      </span>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".jpg,.jpeg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      ( Upload Format in .jpg )
                    </p>
                  </>
                )}
              </td>
              <td className="px-4 py-3 font-medium">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitted || isLoading}
                  className={`px-4 py-2 text-white rounded-md ${
                    isSubmitted
                      ? "cursor-not-allowed "
                      : isLoading
                      ? "bg-yellow-500"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isLoading ? (
                    "Processing..."
                  ) : isSubmitted ? (
                    <i className="bi bi-check-circle-fill text-green-600 text-3xl"></i>
                  ) : (
                    "Submit"
                  )}
                </button>
              </td>
            </tr>
          </tbody>
        </motion.table>
      </motion.div>
    </div>
  );
}
