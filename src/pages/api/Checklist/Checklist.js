// api/Checklist/Checklist
import { connect } from '../../../lib/db';
import Checklist from '../../../models/Checklist';

export default async function handler(req, res) {
  await connect();

 if (req.method === "POST") {
    const {
      studentId,
      type,
      rejectedPoints,
      approvedPoints,
      qaId,
      qaName,
      rollNumber,
      optionalMessage,
    } = req.body;

    try {
      // ✅ Check if checklist already exists for this studentId and type
      const existingChecklist = await Checklist.findOne({ studentId, type });

      if (existingChecklist) {
        // ✅ Update the existing checklist
        existingChecklist.rejectedPoints = rejectedPoints;
        existingChecklist.approvedPoints = approvedPoints;
        existingChecklist.qaId = qaId;
        existingChecklist.qaName = qaName;
        existingChecklist.optionalMessage = optionalMessage;

        await existingChecklist.save();

        return res.status(200).json({ message: "Checklist updated successfully", updated: true });
      } else {
        // ✅ Create a new checklist
        const newChecklist = new Checklist({
          studentId,
          qaId,
          qaName,
          rollNumber,
          type,
          rejectedPoints,
          approvedPoints,
          optionalMessage,
        });

        await newChecklist.save();

        return res.status(201).json({ message: "Checklist created successfully", created: true });
      }
    } catch (error) {
      console.error("Checklist API Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}