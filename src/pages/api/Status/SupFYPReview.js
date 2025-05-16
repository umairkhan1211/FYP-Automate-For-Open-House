import { connect } from "../../../lib/db"; // Ensure this file exists and connects to MongoDB
import Status from "../../../models/Status"; // Assuming Supervisor is your MongoDB model for the supervisor

export default async function handler(req, res) {
  const { method } = req;

  await connect(); // Connect to the database

  if (method === "PUT") {
    const { studentId, supervisorId, status } = req.body;

    console.log("supervisor fyp review ma kya api ma ", req.body);

    try {
      // Find the supervisor by ID and update the supervisorCvReview status
      const supervisor = await Status.findOneAndUpdate(
        { studentId, supervisorId },
        {
          supervisorFypReview: status,

          fypStatus: status, // ✅ Yeh bhi ab update hoga
          updatedAt: new Date(),
        },
        { new: true }
      );

      console.log("suprevisor rejecton", supervisor);

      if (!supervisor) {
        return res.status(404).json({ error: "Supervisor not found" });
      }

      return res
        .status(200)
        .json({ message: "Supervisor FYP review status updated", supervisor });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Server error", message: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
