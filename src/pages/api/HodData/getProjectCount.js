import User from '../../../models/User';
import { connect } from '../../../lib/db';
import { getRelatedDepartments } from '../../../../utils/departmentHelper';

export default async function handler(req, res) {
  await connect();

  try {
    const { department } = req.query;

    if (!department) {
      return res.status(400).json({ success: false, message: 'Department is required' });
    }

    const relatedDepartments = getRelatedDepartments(department);

    // Get all students in the related departments with project titles
    const students = await User.find({
      department: { $in: relatedDepartments },
      role: 'student',
      projectTitle: { $exists: true, $ne: '' }
    });

    // Extract unique project titles
    const uniqueProjectTitles = [...new Set(students.map(student => student.projectTitle))];

    res.status(200).json({
      success: true,
      totalProjects: uniqueProjectTitles.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}