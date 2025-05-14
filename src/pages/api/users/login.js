import bcrypt from "bcrypt";
import { connect } from "../../../lib/db";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connect();

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the entered password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const tokenData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      rollNumber: user.rollNumber,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // Set the token cookie
    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; Max-Age=3600; SameSite=Strict`
    );

    // Return the response with the success message, user role, and user ID
    return res.status(200).json({
      message: "Logged In Success",
      success: true,
      role: user.role, // Send the user role in the response
      userId: user._id, // Include the user ID in the response
      department: user.department,
      rollNumber: user.rollNumber,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  } 
}
