import { connect } from "../../../lib/db";
import Status from "../../../models/Status";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  await connect();

  const { studentId, supervisorId, status } = req.body;

  try {
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
    }).select('_id');

    // 3. Update status for all group members
    const updateResult = await Status.updateMany(
      {
        studentId: { $in: groupMembers.map(m => m._id) },
        supervisorId
      },
      {
        supervisorBannerReview: status,
        bannerStatus: status,
        updatedAt: new Date()
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: "No matching records found" });
    }

    return res.status(200).json({ 
      message: "Supervisor banner review status updated for all group members",
      updatedCount: updateResult.modifiedCount
    });

  } catch (error) {
    return res.status(500).json({ 
      error: "Server error", 
      message: error.message 
    });
  }
}