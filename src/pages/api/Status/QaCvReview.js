import { connect } from "../../../lib/db";
import Status from "../../../models/Status";

export default async function handler(req, res) {
  await connect();

  if (req.method === "PUT") {
    const { studentId, qaId, qaName, cvStatus, supervisorCvReview, qaCvReview } = req.body;

    try {
      const updateDoc = await Status.findOneAndUpdate(
        { studentId },
        { 
          cvStatus,
          supervisorCvReview,
          qaCvReview,
          qaId,
          qaName,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!updateDoc) {
        return res.status(404).json({ success: false, message: "Student record not found" });
      }

      return res.status(200).json({ 
        success: true,
        message: "CV status updated",
        data: updateDoc 
      });
    } catch (err) {
      return res.status(500).json({ 
        success: false,
        message: "Server error",
        error: err.message 
      });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}