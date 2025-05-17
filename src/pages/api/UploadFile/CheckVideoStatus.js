import {connect} from '../../../lib/db';
import User from '../../../models/User';
import Upload from '../../../models/Upload';

export default async function handler(req, res) {
  await connect();

  const { userId } = req.query;

  try {
    // 1. Get the logged in user's data
    const loggedInUser = await User.findById(userId);
    if (!loggedInUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Get all users in the same project group
    const groupMembers = await User.find({ 
      projectTitle: loggedInUser.projectTitle,
      role: 'student'
    }).select('_id');

    // 3. Check if any group member has uploaded video or banner
    const uploadData = await Upload.findOne({ 
      user: { $in: groupMembers.map(m => m._id) },
      $or: [
        { 'video.videoUrl': { $exists: true, $ne: null } },
        { 'video.bannerImageFilePath': { $exists: true, $ne: null } }
      ]
    });

    let videoUrlExists = false;
    let bannerImageExists = false;

    if (uploadData) {
      if (uploadData.video?.videoUrl) {
        videoUrlExists = true;
      }
      if (uploadData.video?.bannerImageFilePath) {
        bannerImageExists = true;
      }
    }

    return res.status(200).json({ 
      videoUrlExists, 
      bannerImageExists,
      projectTitle: loggedInUser.projectTitle
    });

  } catch (error) {
    console.error("CheckVideoStatus Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}