import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";

export default function CVUpload({ userId, rollNumber }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [similarity, setSimilarity] = useState(null);
  const [details, setDetails] = useState(null);
  const [templateFile, setTemplateFile] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkCvUploadStatus = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/UploadFile/CvStatus?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to check CV status');
        const data = await response.json();
        setUploadMessage(data.message);
        setIsSubmitted(!!data.cvFilePath);
      } catch (error) {
        console.error("Error checking CV upload status:", error);
        toast.error("Failed to check CV upload status");
      }
    };

    const fetchTemplate = async () => {
      try {
        const response = await axios.get("/api/UploadFile", {
          params: { uploadType: "cvTemplate" }
        });
        if (response.data.length > 0) {
          const template = response.data[0];
          setTemplateFile(template);
          
          // Check if template is expired
          const now = new Date();
          const expiryDate = new Date(template.expiryDate);
          setIsExpired(now > expiryDate);
        }
      } catch (error) {
        console.error("Error fetching CV template:", error);
        toast.error("Failed to load CV template");
      }
    };

    checkCvUploadStatus();
    fetchTemplate();
  }, [userId]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(selectedFile.type.toLowerCase())) {
        toast.error("Only JPG/PNG files are allowed");
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size too large (max 5MB)");
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

  const compareCVs = async (templatePath, studentFile) => {
    try {
      // Validate student file
      if (!studentFile || !['image/jpeg', 'image/png', 'image/jpg'].includes(studentFile.type.toLowerCase())) {
        throw new Error('Invalid file format. Please upload a JPG or PNG image.');
      }

      const formData = new FormData();
      
      // Fetch template file from server
      const templateResponse = await fetch(`/api/UploadFile/download?filePath=${encodeURIComponent(templatePath)}`);
      if (!templateResponse.ok) {
        throw new Error('Failed to download template file');
      }
      
      const templateBlob = await templateResponse.blob();
      const templateFile = new File([templateBlob], "template.jpg", { 
        type: templateBlob.type || "image/jpeg" 
      });

      formData.append("template", templateFile);
      formData.append("studentCV", studentFile);

      const response = await fetch("/api/CvAutomation/compare", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Comparison failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Comparison error:", error);
      throw new Error(`CV comparison failed: ${error.message}`);
    }
  };

  const handleDownloadTemplate = async () => {
    if (!templateFile) return;
    
    try {
      const response = await fetch(`/api/UploadFile/download?filePath=${encodeURIComponent(templateFile.filePath)}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = templateFile.fileName || 'cv_template.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download template');
      console.error('Download error:', error);
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

    if (!templateFile) {
      toast.error("No CV template available for comparison.");
      return;
    }

    const loadingToastId = toast.loading("Validating CV...");
    setIsLoading(true);

    try {
      // Step 1: Compare CV with template
      let comparisonResult;
      try {
        comparisonResult = await compareCVs(templateFile.filePath, file);
      } catch (error) {
        console.error("CV comparison error:", error);
        throw new Error("Failed to compare CV with template. Please ensure you uploaded a valid image file.");
      }
      
      setSimilarity(comparisonResult.similarity);
      setDetails(comparisonResult.details);

      if (comparisonResult.similarity < 90) {
        toast.error(`CV similarity is only ${comparisonResult.similarity}%. Needs to be at least 90%.`, { id: loadingToastId });
        return;
      }

      // Step 2: Upload CV if similarity is sufficient
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

      // Step 3: Submit CV status
      const submitRes = await fetch("/api/Status/CVSubmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: userId,
          rollNumber,
        }),
      });

      if (!submitRes.ok) {
        const submitData = await submitRes.json();
        throw new Error(submitData.message || "Failed to update CV status");
      }

      // Success
      toast.success("CV uploaded successfully!", { id: loadingToastId });
      setIsSubmitted(true);
      setUploadMessage("CV submitted successfully");

      // Remove notification if exists
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

  if (isExpired) {
    return (
      <div className="flex-1 overflow-auto mb-10 p-4 rounded-lg w-full">
        <h2 className="font-extrabold text-base text-[#0069D9] p-4 text-center">
          CV UPLOAD
        </h2>
        <div className="text-center text-red-600 font-bold mb-4">
          CV submission period has ended
        </div>
      </div>
    );
  }

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

      {templateFile && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">CV Template</h3>
          <div className="flex items-center justify-between">
            <span>{templateFile.fileName}</span>
            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isLoading}
            >
              Download Template
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Valid until: {new Date(templateFile.expiryDate).toLocaleString()}
          </p>
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
              <td className="px-4 py-3 font-medium">
                {templateFile ? new Date(templateFile.startDate).toLocaleDateString() : "N/A"}
              </td>
              <td className="px-4 py-3 font-medium">
                {templateFile ? new Date(templateFile.endDate).toLocaleDateString() : "N/A"}
              </td>
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
                      accept=".jpg,.jpeg,.png"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      (Upload Format in .jpg/.png)
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

        {/* Comparison Results */}
        {similarity !== null && (
          <div className={`mt-6 p-4 rounded-lg ${
            similarity >= 90 ? "bg-green-100 text-black" : "bg-red-100 text-black"
          }`}>
            <h3 className="font-bold text-lg mb-2">Comparison Results</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className={`h-4 rounded-full ${
                  similarity >= 90 ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${similarity}%` }}
              ></div>
            </div>
            <p className="text-center font-medium">
              Similarity: {similarity}% {similarity >= 90 ? "✅" : "❌"}
            </p>
            
            {details && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Detailed Analysis:</h4>
                <ul className="space-y-1">
                  <li>Layout: {details.layout}%</li>
                  <li>Sections: {details.sections}%</li>
                  <li>Structure: {details.structure}%</li>
                  {details.content && <li>Content: {details.content}%</li>}
                  {details.style && <li>Style: {details.style}%</li>}
                </ul>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}