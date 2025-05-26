// api/notifications.js
import { connect } from '../../../lib/db';
import Notification from '../../../models/Notification';
import User from '../../../models/User';

export default async function handler(req, res) {
  await connect();

  if (req.method === 'POST') {
    console.log("Request Body:", req.body);
    try {
      const { studentId, supervisorId, rollNumber, type, userId, userName, userRole, rejectedPoints, optionalMessage } = req.body;

      // First create notification for the main student
      const notification = new Notification({
        studentId,
        supervisorId,
        rollNumber,
        type,
        userId,
        userName,
        userRole,
        rejectedPoints,
        optionalMessage
      });
      await notification.save();

      // For CV type, we only notify the submitting student
      if (type === 'cv') {
        return res.status(201).json({ success: true, data: notification });
      }

      // For other types (fyp, video, banner), notify group members if there are rejected points
      if (rejectedPoints && rejectedPoints.length > 0) {
        const submittingStudent = await User.findById(studentId);
        
        if (submittingStudent && submittingStudent.projectTitle) {
          // Find all students with the same project title (group members)
          const groupMembers = await User.find({
            projectTitle: submittingStudent.projectTitle,
            _id: { $ne: studentId }, // Exclude the submitting student
            role: 'student' // Only students
          });

          // Create notifications for each group member
          for (const member of groupMembers) {
            const memberNotification = new Notification({
              studentId: member._id,
              supervisorId,
              rollNumber: member.rollNumber,
              type,
              userId,
              userName,
              userRole,
              rejectedPoints,
              optionalMessage: optionalMessage 
            });
            await memberNotification.save();
          }
        }
      }

      res.status(201).json({ success: true, data: notification });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}