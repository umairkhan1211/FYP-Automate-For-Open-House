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

    // Delete both supervisor and QA notifications of type 'cv'
    const result = await Notification.deleteMany({
      studentId: objectId,
      rollNumber: rollNumber,
      type: "cv",
      userRole: { $in: ["supervisor", "qa"] }, // Match either role
    });

    console.log("Delete result:", result);

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Notification(s) deleted" });
    } else {
      res.status(404).json({ message: "No matching notifications found" });
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
}
