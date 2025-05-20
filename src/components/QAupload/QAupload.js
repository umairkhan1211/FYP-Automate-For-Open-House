import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function QAupload({ userId }) {
  const [formData, setFormData] = useState({
    uploadType: "",
    file: null,
    expiryDate: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate CV template file type
    if (formData.uploadType === 'cvTemplate' && formData.file) {
      const validTypes = ['image/jpeg', 'image/jpg'];
      if (!validTypes.includes(formData.file.type.toLowerCase())) {
        toast.error('Only JPG images are allowed for CV templates');
        return;
      }
    }
    
    if (!formData.file) {
      toast.error("Please select a file");
      return;
    }

    if (!userId) {
      toast.error("User authentication failed. Please log in again.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Uploading file...");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("uploadType", formData.uploadType);
      formDataToSend.append("file", formData.file);
      formDataToSend.append("expiryDate", formData.expiryDate);
      formDataToSend.append("uploadedBy", userId);

    // In your QAupload component
const response = await axios.post(
  "/api/QaUpload/uploadFile", // Must match exactly
  formDataToSend,
  {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }
);
      toast.success("File uploaded successfully!", { id: toastId });
      // Reset form
      setFormData({
        uploadType: "",
        file: null,
        expiryDate: ""
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload failed", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full overflow-x-hidden px-4">
      <div className="p-6 max-w-2xl mx-auto w-full bg-gray-100 border-2 rounded-lg border-[#0069D9]">
        <p className="text-[#0069D9] text-2xl text-center font-extrabold mb-4">Upload Form</p>
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload Type
              </label>
              <select
                name="uploadType"
                value={formData.uploadType}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select upload type</option>
                <option value="cvTemplate">CV Template</option>
                <option value="fypDocument">FYP Document</option>
                <option value="video">Video</option>
                <option value="banner">Banner</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload File
              </label>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Expiry Date
            </label>
            <input
              type="datetime-local"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`border-2 rounded-lg text-md font-semibold py-1 px-4 border-[#0069D9] text-white bg-[#0069D9] hover:bg-white hover:text-[#0069D9] hover:border-[#0069D9] focus:outline-none focus:shadow-outline ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}