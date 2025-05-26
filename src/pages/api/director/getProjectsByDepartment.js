import { connect } from "../../../lib/db";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import Status from "../../../models/Status";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decoded.role !== "director") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { department } = req.query;
    if (!department) {
      return res.status(400).json({ message: "Department is required" });
    }

    await connect();

    // Find all students in the department
    const students = await User.find({
      role: "student",
      department: department,
    }).lean();

    if (students.length === 0) {
      return res.status(200).json({
        success: true,
        projects: [],
        message: "No students found in this department",
      });
    }

    // Get all unique supervisor IDs
    const supervisorIds = students
      .map(student => student.supervisor)
      .filter(id => id); // Remove undefined/null

    // Get all supervisors in one query
    const supervisors = await User.find({
      _id: { $in: supervisorIds },
      role: "supervisor"
    }).lean();

    // Create a map of supervisor IDs to names for quick lookup
    const supervisorMap = {};
    supervisors.forEach(supervisor => {
      supervisorMap[supervisor._id.toString()] = supervisor.name;
    });

    // Get status for each student
    const statuses = await Status.find({
      studentId: { $in: students.map((s) => s._id) },
    }).lean();

    // Combine student and status data
    const projects = students.map((student) => {
      const status = statuses.find(
        (s) => s.studentId.toString() === student._id.toString()
      );
      
      // Get supervisor name from the map
      const supervisorName = student.supervisor 
        ? supervisorMap[student.supervisor.toString()] || "N/A"
        : "N/A";

      return {
        ...student,
        ...(status || {}),
        supervisorName,
        rollNumber: student.rollNumber || "N/A",
      };
    });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}