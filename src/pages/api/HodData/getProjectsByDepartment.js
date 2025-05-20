// pages/api/HodData/getProjectsByDepartment.js
import User from '../../../models/User';
import Status from '../../../models/Status';
import { connect } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { department } = req.query;
    if (!department) {
      return res.status(400).json({ message: 'Department is required' });
    }

    await connect();

    // Get students with projects in this department using Mongoose
    const students = await User.find({ 
      role: 'student',
      department: department 
    }).lean(); // Use lean() for plain JavaScript objects

    if (!students || students.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No students found for this department' 
      });
    }

    // Get status for each student's project
    const projectsWithStatus = await Promise.all(students.map(async (student) => {
      const status = await Status.findOne({ 
        studentId: student._id 
      }).lean();

      // Get supervisor name
      let supervisorName = "N/A";
      if (student.supervisor) {
        const supervisor = await User.findById(student.supervisor).lean();
        supervisorName = supervisor?.name || "N/A";
      }

      // Get QA name if available
      let qaName = "N/A";
      if (status?.qaId) {
        const qa = await User.findById(status.qaId).lean();
        qaName = qa?.name || "N/A";
      }

      return {
        projectTitle: student.projectTitle || "N/A",
        rollNumber: student.rollNumber || "N/A",
        supervisorName,
        qaName,
        ...status,
        _id: student._id.toString()
      };
    }));

    res.status(200).json({ 
      success: true, 
      projects: projectsWithStatus 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}