import { connect } from "../../../lib/db";
import Notification from "../../../models/Notification";
import User from "../../../models/User";

export default async function handler(req, res) {
  await connect();

  if (req.method === 'GET') {
    const { userId, role } = req.query;

    try {
      let notifications = [];

      if (role === 'student') {
        // 1. Find the student and get roll number
        const student = await User.findOne({ _id: userId, role: 'student' });

        if (student && student.rollNumber) {
          notifications = await Notification.find({
            rollNumber: student.rollNumber,
            userRole: { $in: ['supervisor', 'qa'] }, // userRole = supervisor or qa
          });
        }

      } else if (role === 'supervisor') {
        // 2. Show only those notifications where supervisorId matches and userRole is 'qa'
        notifications = await Notification.find({
          supervisorId: userId,
          userRole: 'qa',
        });
      }

      res.status(200).json({ success: true, notifications });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }

  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
