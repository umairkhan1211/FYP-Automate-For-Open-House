import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function CVUpload() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsFileUploaded(true);
      toast.success("File Uploaded Successfully!");
    }
  };

  const handleUploadClick = (event) => {
    event.preventDefault();
    if (!isSubmitted) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (uploadType) => {
    if (!file) {
      toast.error("Please upload a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("cvFile", file); // Change "file" to "cvFile"
    formData.append("userId", localStorage.getItem("userId"));
    formData.append("fileType", "cv"); // Add fileType

    setIsUploading(true);

    try {
      const response = await fetch("/api/UploadFile/Upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("File Submitted Successfully!");
        setIsSubmitted(true);
      } else {
        toast.error(`Error submitting file: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto mb-10 p-4 rounded-lg w-full">
      <h2 className="font-extrabold text-base text-[#0069D9] p-4 text-center">
        CV UPLOAD
      </h2>
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
              <td className="px-4 py-3 font-medium flex flex-col items-center  justify-center">
                <button
                  onClick={handleUploadClick}
                  className={`p-2 rounded-full  text-[#0069D9] hover:bg-gray-300 transition-all duration-200 ${
                    isSubmitted ? " cursor-not-allowed" : ""
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
                  accept=".png" // Allow only PNG files
                />
                {/* Moved the text below the upload icon */}
                <p className="text-xs text-gray-500 mt-1">
                  ( Upload Format in .jpg ) 
                </p>
              </td>
              <td className="px-4 py-3 font-medium">
                <button
                  onClick={() => handleSubmit("cv")}
                  className={`px-4 py-2 text-white rounded-md ${
                    isSubmitted ? "cursor-not-allowed" : "bg-green-500"
                  }`}
                  disabled={isSubmitted}
                >
                  {isSubmitted ? (
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
