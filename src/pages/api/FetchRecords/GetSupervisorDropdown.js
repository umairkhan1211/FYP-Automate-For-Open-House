// In your backend API route (e.g., /api/supervisors.js)
import { connect } from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connect();

  try {
    const supervisors = await User.find({ role: 'supervisor' }).select('name _id');
    return res.status(200).json(supervisors);
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
