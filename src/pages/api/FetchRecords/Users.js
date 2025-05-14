import { connect } from "../../../lib/db";
import User from "../../../models/User"; // Ensure correct model import

export default async function handler(req, res) {
  await connect(); // Connect to MongoDB

  const { role, id, department } = req.query; // Added department query param

  if (req.method === "DELETE") {
    if (!id) {
      return res.status(400).json({ error: "User ID is required for deletion" });
    }
    try {
      await User.findByIdAndDelete(id);
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Failed to delete user" });
    }
  } 

  else if (req.method === "PUT") {
    try {
      const { name, email, department, rollNumber } = req.body;
      if (!id) {
        return res.status(400).json({ error: "User ID is required for update" });
      }
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, department , rollNumber},
        { new: true }
      );
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Failed to update user" });
    }
  } 

  
  
  else if (req.method === "GET") {
    try {
      let filter = {};
  
      if (role) {
        filter.role = role;
      }
      if (department && department !== "All") {
        filter.department = department;
      }
  
      let users = await User.find(filter);
  
      // ✅ If role is student, populate supervisor's name from User collection
      if (role === "student") {
        const supervisorMap = {};
        const supervisorIds = users
          .map((u) => u.supervisor)
          .filter((id) => id); // Get supervisor IDs
  
        const supervisors = await User.find({ _id: { $in: supervisorIds } });
  
        supervisors.forEach((sup) => {
          supervisorMap[sup._id.toString()] = sup.name;
        });
  
        users = users.map((u) => ({
          ...u._doc,
          supervisor: supervisorMap[u.supervisor?.toString()] || "N/A",
        }));
      }
  
      return res.status(200).json(users);
    } catch (error) {
      console.error(`Error fetching records:`, error);
      return res.status(500).json({ error: `Failed to fetch records` });
    }
  }
}