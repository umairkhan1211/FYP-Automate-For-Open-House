import { connect } from '../../../lib/db';
import User from '../../../models/User';
import Upload from '../../../models/Upload';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  await connect();

  try {
    // Fetch the user to get the project title
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { projectTitle } = user;

    // Fetch all users with the same project title
    const usersWithSameProject = await User.find({ projectTitle });

    // Check if any of these users have an FYP document uploaded
    const uploads = await Upload.find({
      user: { $in: usersWithSameProject.map(u => u._id) },
      'fypDocument.filePath': { $ne: null } // Ensure this field is correctly checked
    });

    const isFypUploaded = uploads.length > 0;

    // Return the upload status
    return res.status(200).json({ isFypUploaded });

  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
