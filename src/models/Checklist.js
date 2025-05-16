import mongoose from "mongoose";

const checklistSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  qaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming QA is a type of User
    required: true,
  },
  qaName: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["cv", "fyp", "video", "banner"],
    required: true,
  },
  approvedPoints: {
    type: [String], // List of accepted parameters
    default: [],
  },
  rejectedPoints: {
    type: [String], // List of rejected parameters
    default: [],
  },
  optionalMessage: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.models.Checklist || mongoose.model("Checklist", checklistSchema);
