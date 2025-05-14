const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  studentId: { type: [mongoose.Schema.Types.ObjectId], required: true }, // Changed to an array
  supervisorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rollNumber: { type: [String], required: true }, // Changed to an array
  type: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: false }, // Optional
  userName: { type: String, required: false }, // Optional
  userRole: { type: String, required: true },
  rejectedPoints: { type: [String], required: true },
  optionalMessage: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);



// import mongoose from "mongoose";

// const NotificationSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
//   supervisorId: { type: mongoose.Schema.Types.ObjectId, required: true },
//   rollNumber: { type: String, required: true },
//   type: { type: String, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, required: true },
//   userName: { type: String, required: true },
//   userRole: { type: String, required: true },
//   rejectedPoints: { type: [String], required: true },
//   optionalMessage: { type: String, default: "" },
//   createdAt: { type: Date, default: Date.now },
// });

// const Notification =
//   mongoose.models.Notification ||
//   mongoose.model("Notification", NotificationSchema);

// export default Notification; // ✅ Only one export
