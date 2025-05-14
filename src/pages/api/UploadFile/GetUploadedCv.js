import { connect } from "../../../lib/db";
import Upload from "../../../models/Upload";

export default async function handler(req, res) {
  await connect();
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const latestUpload = await Upload.findOne({ user: userId }).sort({ createdAt: -1 });

    if (!latestUpload) {
      return res.status(404).json({ message: "No uploaded data found for this user." });
    }

    res.status(200).json({
      cvFilePath: latestUpload.cvFilePath || "",

      // Check if `fypDocument` and `video` exist to avoid errors
      fypDocument: latestUpload.fypDocument?.filePath
        ? latestUpload.fypDocument.filePath.replace("public", "")
        : "",
      originalFileName: latestUpload.fypDocument?.originalFileName || "",
      projectTitle: latestUpload.fypDocument?.projectTitle || "",
      groupMembers: latestUpload.fypDocument?.groupMembers || [],
      videoUrl: latestUpload.video?.videoUrl || "",
      bannerImageFilePath: latestUpload.video?.bannerImageFilePath || ""
    });
  } catch (error) {nb
    console.error("APnnbbbn/ I Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}
