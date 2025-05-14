import { connect } from "../../../lib/db";
import Upload from "../../../models/Upload";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await connect();

    const { studentId } = req.body;

    const updated = await Upload.findOneAndUpdate(
      { user: new mongoose.Types.ObjectId(studentId) }, // FIXED: changed from studentId to user
      { $set: { cvFilePath: null } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "CV path removed successfully", updated });
  } catch (error) {
    console.error("Error removing CV path:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
