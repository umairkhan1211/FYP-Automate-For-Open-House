import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  cvFilePath: {
    type: String,
    default: null, // Default to null if no CV is uploaded
  },
  fypDocument: {
    filePath: {
      type: String,
      default: null, // Default to null if no FYP document is uploaded
    },
  },
  video: {
    videoUrl: {
      type: String,
      default: null, // Default to null if no video URL is provided
    },
    bannerImageFilePath: {
      type: String,
      default: null, // Default to null if no banner image is uploaded
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Upload = mongoose.models.Upload || mongoose.model("Upload", uploadSchema);

export default Upload;
