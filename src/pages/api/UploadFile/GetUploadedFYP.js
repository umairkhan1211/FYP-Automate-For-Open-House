import { connect } from "../../../lib/db";
import User from "../../../models/User";
import Upload from "../../../models/Upload";

export default async function handler(req, res) {
  await connect();
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

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
      'fypDocument.filePath': { $ne: null }
    });

    if (uploads.length > 0) {
      const fypDocumentPath = uploads[0].fypDocument.filePath.replace("public", "");
      return res.status(200).json({ fypDocumentPath });
    } else {
      return res.status(404).json({ message: "No FYP document found." });
    }

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}
