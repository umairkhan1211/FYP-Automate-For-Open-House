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
        let filter = {}; // Initialize filter object

        if (role) {
            filter.role = role; // Apply role filter if provided
        }
        if (department && department !== "All") { // Ensure "All" does not filter
            filter.department = department; // Apply department filter
        }

        const users = await User.find(filter); // Fetch users based on filters
        return res.status(200).json(users);
    } catch (error) {
        console.error(`Error fetching records:`, error);
        return res.status(500).json({ error: `Failed to fetch records` });
    }
}

}