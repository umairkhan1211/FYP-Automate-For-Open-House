import { connect } from "../../../lib/db";
import Upload from "../../../models/Upload";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connect();

  if (req.method === "PUT") {
    const { studentId } = req.body;
    try {
      const updated = await Upload.findOneAndUpdate(
        { user: new mongoose.Types.ObjectId(studentId) },
        { $set: { "video.videoUrl": null } },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }

      return res.status(200).json({ success: true, updated });
    } catch (err) {
      console.error("Error removing video URL:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
