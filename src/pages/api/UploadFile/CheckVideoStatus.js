import {connect} from '../../../lib/db'; // Ensure you have a utility to connect to your database
import User from '../../../models/User'; // Import your User model
import Upload from '../../../models/Upload'; // Import your Upload model

export default async function handler(req, res) {
  await connect();

  const { userId } = req.query;

  try {
    const loggedInUser = await User.findById(userId);

    if (!loggedInUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const uploadData = await Upload.findOne({ user: loggedInUser._id });

    let videoUrlExists = false;
    let bannerImageExists = false;

    if (uploadData && uploadData.video) {
      if (uploadData.video.videoUrl) {
        videoUrlExists = true;
      }

      if (uploadData.video.bannerImageFilePath) {
        bannerImageExists = true;
      }
    }

    return res.status(200).json({ videoUrlExists, bannerImageExists });

  } catch (error) {
    console.error("CheckVideoStatus Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
