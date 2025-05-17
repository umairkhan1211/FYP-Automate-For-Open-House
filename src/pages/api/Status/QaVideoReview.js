import { connect } from "../../../lib/db";
import Status from "../../../models/Status";
import User from "../../../models/User";

export default async function handler(req, res) {
  await connect();

  if (req.method === "PUT") {
    const { studentId, qaId, qaName, videoStatus, supervisorVideoReview, qaVideoReview } = req.body;

    try {
      // 1. Get student's project title
      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }
      const projectTitle = student.projectTitle;

      // 2. Find all students in same project group
      const groupMembers = await User.find({ 
        projectTitle,
        role: 'student'
      }).select('_id');

      // 3. Update status for all group members
      const updateResult = await Status.updateMany(
        { studentId: { $in: groupMembers.map(m => m._id) } },
        { 
          videoStatus,
          supervisorVideoReview,
          qaVideoReview,
          qaId,
          qaName,
          updatedAt: new Date()
        }
      );

      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ success: false, message: "No student records found" });
      }

      return res.status(200).json({ 
        success: true,
        message: "Video status updated for all group members",
        updatedCount: updateResult.modifiedCount
      });
    } catch (err) {
      return res.status(500).json({ 
        success: false,
        message: "Server error",
        error: err.message 
      });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}