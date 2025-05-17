import mongoose from "mongoose";
import { connect } from "../../../lib/db";
import Notification from "../../../models/Notification";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { studentId, rollNumber } = req.body;

  try {
    await connect();

    // 1. Get the student's project title
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    const projectTitle = student.projectTitle;

    // 2. Find all students in the same project group
    const groupMembers = await User.find({ 
      projectTitle,
      role: 'student'
    }).select('_id rollNumber');

    // 3. Delete notifications for all group members
    const result = await Notification.deleteMany({
      studentId: { $in: groupMembers.map(m => m._id) },
      rollNumber: { $in: groupMembers.map(m => m.rollNumber) },
      type: "video",
      userRole: { $in: ["supervisor", "qa"] }
    });

    console.log("Delete result:", result);

    if (result.deletedCount > 0) {
      res.status(200).json({ 
        message: "Video notifications deleted for all group members",
        deletedCount: result.deletedCount
      });
    } else {
      res.status(404).json({ message: "No matching notifications found" });
    }
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
}