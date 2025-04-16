import path from "path";
import fs from "fs";
import multer from "multer";
import Upload from "../../../models/Upload"; // Ensure this path is correct
import mongoose from "mongoose";
import { connect } from "../../../lib/db";

export const config = {

  

  api: {
    bodyParser: false, // Since using multer
  },
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "public/uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  const filetypes = {
    cvFile: /jpeg|jpg/, // Accept .jpg for CV
    fypDocument: /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/msword/, // Accept .docx, .doc
    videoThumbnail: /jpeg|jpg/, // Accept .jpg for video thumbnail
  };

  const fieldName = file.fieldname;
  const isValid = filetypes[fieldName] && filetypes[fieldName].test(file.mimetype);

  if (isValid) {
    return cb(null, true);
  } else {
    return cb(new Error(`Error: Invalid file type for ${fieldName}.`));
  }
};

// Define the fields expected in the form
const upload = multer({ storage, fileFilter }).fields([
  { name: 'cvFile', maxCount: 1 },
  { name: 'fypDocument', maxCount: 1 },
  { name: 'videoThumbnail', maxCount: 1 }
]);

// API Handler
const handler = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    await connect();

    const { userId, fileType, projectTitle, groupMembers, videoUrl } = req.body;

    if (!userId) return res.status(400).json({ error: "User ID is required." });
    if (!fileType) return res.status(400).json({ error: "File type is required." });

    const allowedFileTypes = ["cv", "fypDocument", "video"];
    if (!allowedFileTypes.includes(fileType)) {
      return res.status(400).json({ error: "Invalid file type." });
    }

    let existingUpload = await Upload.findOne({ user: userId });

    if (!existingUpload) {
      existingUpload = new Upload({ user: userId });
    }

    if (fileType === "cv") {
      if (!req.files.cvFile) return res.status(400).json({ error: "CV file is required." });
      existingUpload.cvFilePath = req.files.cvFile[0].path.replace(/\\/g, "/"); // ✅ Convert path
    } else if (fileType === "fypDocument") {
      if (!req.files.fypDocument) return res.status(400).json({ error: "FYP document is required." });
    
      const groupMembersArray = groupMembers ? JSON.parse(groupMembers) : [];
      
      const originalFileName = req.files.fypDocument[0].originalname; // Store the original file name
    
      existingUpload.fypDocument.filePath = req.files.fypDocument[0].path.replace(/\\/g, "/");
      existingUpload.fypDocument.originalFileName = originalFileName;  // Store the original file name
      existingUpload.fypDocument.projectTitle = projectTitle || null;
      existingUpload.fypDocument.groupMembers = groupMembersArray;
    }
     else if (fileType === "video") {
      if (!videoUrl) return res.status(400).json({ error: "Video URL is required." });
      if (!req.files.videoThumbnail) return res.status(400).json({ error: "Thumbnail is required for video." });

      existingUpload.video.videoUrl = videoUrl || null;
      existingUpload.video.bannerImageFilePath = req.files.videoThumbnail[0].path.replace(/\\/g, "/"); // ✅ Convert path
    }

    await existingUpload.save();

    res.status(200).json({ message: "File uploaded successfully", data: existingUpload });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;