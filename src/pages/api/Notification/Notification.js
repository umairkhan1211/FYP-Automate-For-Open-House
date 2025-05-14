// api/notifications.js
import {connect} from '../../../lib/db';
import Notification from '../../../models/Notification';

export default async function handler(req, res) {
  await connect();

  if (req.method === 'POST') {
    console.log("Request Body:", req.body);
    try {
      const { studentId, supervisorId, rollNumber, type, userId, userName, userRole, rejectedPoints, optionalMessage } = req.body;
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
      res.status(201).json({ success: true, data: notification });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}