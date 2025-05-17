import { connect } from "../../../lib/db";
import Notification from "../../../models/Notification";
import User from "../../../models/User";

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
      } = req.body;

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
      });

      // 3. Create notifications for all group members
      const notificationPromises = groupMembers.map(async (member) => {
        const newNotification = new Notification({
          studentId: member._id,
          rollNumber: member.rollNumber,
          supervisorId,
          type,
          userRole,
          rejectedPoints: [`${type} was rejected by supervisor`],
          optionalMessage: optionalMessage || ""
        });
        return newNotification.save();
      });

      await Promise.all(notificationPromises);

      return res.status(201).json({
        message: "Notifications created for all group members",
        count: groupMembers.length
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