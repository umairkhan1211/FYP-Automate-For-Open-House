import Notification from "../../../models/Notification";
import { connect } from "../../../lib/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  await connect();

  if (req.method === "POST") {
    try {
      const {
        studentId,
        supervisorId,
        rollNumber,
        userRole,
        type,
        optionalMessage = "",
      } = req.body;

      // For CV type, only notify the student who uploaded the CV
      if (type === "cv") {
        const student = await User.findById(studentId);
        if (!student) {
          return res.status(404).json({ error: "Student not found" });
        }

        const notification = new Notification({
          studentId,
          supervisorId,
          rollNumber,
          type,
          userRole,
          rejectedPoints: ["FYP document was rejected by supervisor"],
          optionalMessage
        });

        await notification.save();

        return res.status(201).json({ 
          message: "CV notification created for the student",
          count: 1
        });
      }

      // Original logic for other types (notifications for all group members)
      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      const projectTitle = student.projectTitle;

      const groupMembers = await User.find({ 
        projectTitle,
        role: 'student'
      });

      const notificationPromises = groupMembers.map(async (member) => {
        const notification = new Notification({
          studentId: member._id,
          supervisorId,
          rollNumber: member.rollNumber,
          type,
          userRole,
          rejectedPoints: ["FYP document was rejected by supervisor"],
          optionalMessage
        });
        return notification.save();
      });

      await Promise.all(notificationPromises);

      res.status(201).json({ 
        message: "Notifications created for all group members",
        count: groupMembers.length
      });

    } catch (error) {
      console.error("Error creating notifications:", error);
      res.status(500).json({ error: "Error creating notifications" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}