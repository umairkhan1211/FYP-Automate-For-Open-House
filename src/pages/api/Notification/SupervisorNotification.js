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