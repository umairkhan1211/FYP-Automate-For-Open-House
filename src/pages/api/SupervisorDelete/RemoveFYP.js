// pages/api/SupervisorDelete/RemoveFYP.js
import { connect } from "../../../lib/db";
import Upload from "../../../models/Upload";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connect();

    const { studentId } = req.body;

    const updated = await Upload.findOneAndUpdate(
      { user: new mongoose.Types.ObjectId(studentId) }, // FIXED: changed from studentId to user
      { $set: { "fypDocument.filePath": null } },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    return res
      .status(200)
      .json({ message: "FYP document file paths removed successfully" });
  } catch (error) {
    console.error("Failed to remove FYP paths:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
