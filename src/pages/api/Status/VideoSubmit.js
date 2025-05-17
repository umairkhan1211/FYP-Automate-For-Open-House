import { connect } from "../../../lib/db";
import Status from "../../../models/Status";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connect();

  const { studentId, rollNumber } = req.body;

  if (!studentId || !rollNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Step 1: Get student data from User model
    const student = await User.findOne({ _id: studentId, rollNumber });
    console.log("Student data:", student);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { supervisor: supervisorId, projectTitle } = student;
    console.log("Supervisor ID:", supervisorId);
    console.log("Project Title:", projectTitle);

    if (!supervisorId || !projectTitle) {
      return res.status(400).json({
        message: "Missing supervisor or project title in student record",
      });
    }

    // Step 2: Get supervisor name using supervisorId
    const supervisor = await User.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    const supervisorName = supervisor.name;

    // Step 3: Find all group members (students with same projectTitle)
    const groupMembers = await User.find({ 
      projectTitle,
      role: 'student'
    });

    // Step 4: Update status for all group members
    const updatePromises = groupMembers.map(async (member) => {
      // Check if status already exists for this member
      const existingStatus = await Status.findOne({
        studentId: member._id,
        projectTitle,
      });

      if (existingStatus) {
        // Update existing status
        if (existingStatus.videoStatus !== "uploaded") {
          existingStatus.videoStatus = "uploaded";
          return existingStatus.save();
        }
        return Promise.resolve(); // No update needed
      } else {
        // Create new status
        const newStatus = new Status({
          studentId: member._id,
          rollNumber: member.rollNumber,
          projectTitle,
          supervisorId,
          supervisorName,
          videoStatus: "uploaded",
        });
        return newStatus.save();
      }
    });

    await Promise.all(updatePromises);

    return res.status(200).json({ message: "Video status updated for all group members" });
  } catch (error) {
    console.error("VideoSubmit error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}