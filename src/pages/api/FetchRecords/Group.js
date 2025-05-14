import { connect } from '../../../lib/db'; // Ensure you have a function to connect to your database
import User from '../../../models/User'; // Import your User model

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connect(); // Connect to your database

    const { role, supervisorId } = req.query; // Use supervisorId instead of supervisor name
    

    // Validate the query parameters
    if (!role || !supervisorId) {
      return res.status(400).json({ message: 'Missing required query parameters' });
    }

    // Fetch students based on the role and supervisor ID
    const students = await User.find({
      role: role.toLowerCase(),
      supervisor: supervisorId, // Match supervisor ID
    });



    return res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
