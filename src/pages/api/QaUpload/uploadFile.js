// pages/api/Qaupload/uploadFile.js
import UploadFile from "../../../models/UploadFile";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import jwt from 'jsonwebtoken';

// Configure multer
const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const dir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (req.body.uploadType === 'cvTemplate') {
      const validTypes = ['image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.mimetype)) {
        return cb(new Error('Only JPG images allowed for CV templates'), false);
      }
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const config = {
  api: {
    bodyParser: false
  }
};

// Create middleware wrapper
const uploadMiddleware = (req, res) => {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

export default async function handler(req, res) {
  // Log request for debugging
  console.log(`Received ${req.method} request to ${req.url}`);

  if (req.method !== "POST") {
    console.log('Method not allowed');
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Verify JWT token
    const token = req.cookies.token;
    if (!token) {
      console.log('No token found');
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decoded.id;
    console.log(`Authenticated user: ${userId}`);

    // Parse form data
    try {
      await uploadMiddleware(req, res);
      console.log('File uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err.message);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { uploadType, expiryDate } = req.body;
    console.log(`Upload type: ${uploadType}, Expiry: ${expiryDate}`);

    const filePath = `/uploads/${req.file.filename}`;
    console.log(`Saving file to: ${filePath}`);

    const newUpload = new UploadFile({
      uploadType,
      filePath,
      fileName: req.file.originalname,
      expiryDate: new Date(expiryDate),
      uploadedBy: userId
    });

    await newUpload.save();
    console.log('File record created in database');

    return res.status(201).json({
      message: "File uploaded successfully",
      file: newUpload
    });

  } catch (error) {
    console.error("API Error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
}