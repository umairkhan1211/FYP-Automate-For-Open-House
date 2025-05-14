import { connect } from "../../../lib/db";
import Users from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    await connect(); // ✅ connect FIRST, before using the DB

    const { department } = req.body;

    if (!department) {
      return res.status(400).json({ error: "Department is required" });
    }

    const students = await Users.find({
      role: "student",
      department: { $in: ["Computer Science", "Software Engineering"] },
    });

    // Group students by project title
    const grouped = {};

    students.forEach((student) => {
      const title = student.projectTitle || "Untitled Project";
      if (!grouped[title]) grouped[title] = [];
      grouped[title].push(student);
    });

    return res.status(200).json({ groups: grouped });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
