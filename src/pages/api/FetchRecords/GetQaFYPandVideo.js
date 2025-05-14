import { connect } from '../../../lib/db';
import Upload from '../../../models/Upload';
import User from '../../../models/User';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { studentIds } = req.body;

  if (!studentIds || !Array.isArray(studentIds)) {
    return res.status(400).json({ message: "Student IDs are required and must be an array" });
  }

  try {
    await connect();

    const userIdArray = studentIds.map(id => new mongoose.Types.ObjectId(id));

    const uploads = await Upload.find({ user: { $in: userIdArray } });
    const users = await User.find({ _id: { $in: userIdArray }, role: 'student' });

    const responseData = [];

    for (const upload of uploads) {
      const { user: userIdObj, fypDocument, video } = upload;
      const userId = userIdObj.toString();

      const fypDocumentPath = fypDocument?.filePath || null;
      const videoUrl = video?.videoUrl || null;
      const bannerImageFilePath = video?.bannerImageFilePath || null;

      if (fypDocumentPath || videoUrl || bannerImageFilePath) {
        const user = users.find(u => u._id.toString() === userId);
        if (user) {
          responseData.push({
            userId,
            rollNumber: user.rollNumber,
            fypDocumentPath,
            videoUrl,
            bannerImageFilePath,
            isComplete: !!(fypDocumentPath && videoUrl && bannerImageFilePath)
          });
        }
      }
    }

    res.status(200).json({ students: responseData });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
