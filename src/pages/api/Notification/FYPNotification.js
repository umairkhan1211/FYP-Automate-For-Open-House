// pages/api/Notification/FYPNotification.js
import { connect } from "../../../lib/db";
import Notification from "../../../models/Notification";

export default async function handler(req, res) {
  await connect();

  if (req.method === "POST") {
    try {
      const {
        studentId,
        rollNumber,
        supervisorId,
        userRole,
        optionalMessage,
        type,
        userId = null,
        userName = null,
        rejectedPoints = [],
      } = req.body;

      const newNotification = new Notification({
        studentId: studentId || null,
        rollNumber: rollNumber || null,
        supervisorId: supervisorId || null,
        type: type || null,
        userId: userId || null,
        userName: userName || null,
        userRole: userRole || null,
        rejectedPoints: rejectedPoints.length
          ? rejectedPoints
          : ["No specific points provided"],
        optionalMessage: optionalMessage || "",
      });

      await newNotification.save();


      return res.status(201).json({
        message: "FYP Notification saved successfully.",
      });
    } catch (error) {
      console.error("Notification Save Error:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
