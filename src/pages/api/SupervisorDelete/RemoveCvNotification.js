import mongoose from "mongoose";
import { connect } from "../../../lib/db";
import Notification from "../../../models/Notification";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { studentId, rollNumber } = req.body;

  try {
    await connect();

    const objectId = new mongoose.Types.ObjectId(studentId);

    const result = await Notification.deleteOne({
      studentId: objectId,
      rollNumber: rollNumber,
      type: "cv", // Ensure this matches the type in your document
      userRole: "supervisor", // Ensure this matches the role in your document
    });

    console.log("Delete result:", result);

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Notification deleted" });
    } else {
      res.status(404).json({ message: "No matching notification found" });
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
}
