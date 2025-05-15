// pages/api/Notification/SupervisorNotification.js
import Notification from "../../../models/Notification";
import { connect } from "../../../lib/db";

export default async function handler(req, res) {
  await connect();

  if (req.method === "POST") {
    try {
      const {
        studentId = null,
        supervisorId = null,
        rollNumber = null,
        userRole = null,
        type = null,
        optionalMessage = "",
        supervisorRole = null,
      } = req.body;

      const notification = new Notification({
        studentId: studentId || null,
        supervisorId: supervisorId || null,
        rollNumber: rollNumber || null,
        type: type || null,
        userId: null,                 // Always null as per your request
        userName: "",                 // Empty string
        userRole: supervisorRole || null,
        rejectedPoints: [],          // Empty list
        optionalMessage: optionalMessage || "",
      });

      await notification.save();
      res.status(201).json({ message: "Notification created successfully" });
    } catch (error) {
      console.error("🔴 Error creating notification:", error);
      res.status(500).json({ error: "Error creating notification" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
