// pages/api/CVSubmit.js
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

    // FIX HERE
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

    // Step 3: Check if status already exists
    const alreadyExists = await Status.findOne({
      studentId,
      rollNumber,
      projectTitle,
      supervisorId,
      supervisorName,
    });

    if (alreadyExists) {
      // If the record exists and fypStatus is "uploaded", update the status only
      if (alreadyExists.videoStatus !== "uploaded") {
        alreadyExists.videoStatus = "uploaded"; // Update the fypStatus
        await alreadyExists.save(); // Save the updated status
        return res
          .status(200)
          .json({ message: "Video status updated successfully" });
      }
      return res.status(200).json({ message: "Video status already uploaded" });
    }

    // Step 4: Save new status
    const newStatus = new Status({
      studentId,
      rollNumber,
      projectTitle,
      supervisorId,
      supervisorName,
      videoStatus: "uploaded",
    });
    console.log("videostatus dekha ", newStatus);

    await newStatus.save();

    return res.status(201).json({ message: "Video status updated successfully" });
  } catch (error) {
    console.error("Video Submit error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
