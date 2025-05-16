
import {connect} from '../../../lib/db';
import Checklist from '../../../models/Checklist';

export default async function handler(req, res) {
  await connect();
  const { rollNumber, type } = req.query;

  try {
    const checklist = await Checklist.findOne({ rollNumber, type });

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    res.status(200).json(checklist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
