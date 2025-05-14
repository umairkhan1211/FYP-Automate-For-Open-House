import {connect} from '../../../lib/db'; // Ensure you have a utility to connect to your database
import User from '../../../models/User'; // Import your User model
import Upload from '../../../models/Upload'; // Import your Upload model

export default async function handler(req, res) {
  await connect(); // Connect to the database

  const { userId } = req.query; // Get the userId from the query parameters

  try {
    // Fetch the logged-in user's details
    const loggedInUser = await User.findById(userId);

    if (!loggedInUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { projectTitle } = loggedInUser;

    // Fetch users with the same project title and role 'student'
    const usersWithSameProjectTitle = await User.find({
      projectTitle,
      role: 'student',
    });

    for (const user of usersWithSameProjectTitle) {
      // Check the Upload model for video URL and banner image file path
      const uploadData = await Upload.findOne({ user: user._id });

      if (uploadData && uploadData.video && uploadData.video.videoUrl) {
        return res.status(200).json({
          videoUrl: uploadData.video.videoUrl,
          bannerImageFilePath: uploadData.video.bannerImageFilePath,
        });
      }
    }

    // If no video URL is found
    return res.status(404).json({ message: 'No video found for the project title' });
  } catch (error) {
    console.error('Error fetching video data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
