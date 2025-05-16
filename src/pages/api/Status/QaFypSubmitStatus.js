import { connect } from "../../../lib/db";
import Status from "../../../models/Status";

export default async function handler(req, res) {
  await connect();

  if (req.method === "GET") {
    const { rollNumber } = req.query;

    try {
      const status = await Status.findOne({ rollNumber });
      
      if (!status) {
        return res.status(404).json({ 
          success: false,
          message: "Student record not found" 
        });
      }

      return res.status(200).json({
        success: true,
        showContent: status.supervisorFypReview === "approved",
        status: status.supervisorFypReview
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