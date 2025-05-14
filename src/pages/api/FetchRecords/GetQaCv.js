import { connect } from "../../../lib/db";
import Users from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ error: "Project title is required" });
    }

    await connect();

    const students = await Users.find({ projectTitle: title });
    console.log(students)

    return res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}