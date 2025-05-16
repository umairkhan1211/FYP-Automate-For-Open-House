import { connect } from "../../../lib/db";
import Status from "../../../models/Status";

export default async function handler(req, res) {
  await connect();

  const { method } = req;

  if (method === "GET") {
    const { studentId, supervisorId } = req.query;

    try {
      const status = await Status.findOne({ studentId, supervisorId });

      if (!status) {
        // Return a default pending status instead of 404
        return res.status(200).json({
          supervisorCvReview: "pending",
        });
      }

      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: "Server error", message: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
