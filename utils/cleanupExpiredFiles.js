// utils/cleanupExpiredFiles.js
import UploadFile from '../src/models/UploadFile';
import { promises as fs } from 'fs';
import path from 'path';

export async function cleanupExpiredFiles() {
  const now = new Date();
  const expiredFiles = await UploadFile.find({ expiryDate: { $lt: now } });
  
  for (const file of expiredFiles) {
    try {
      // Delete file from filesystem
      const filePath = path.join(process.cwd(), 'public', file.filePath);
      await fs.unlink(filePath);
      
      // Delete record from database
      await UploadFile.deleteOne({ _id: file._id });
    } catch (error) {
      console.error(`Error deleting file ${file.filePath}:`, error);
    }
  }
}