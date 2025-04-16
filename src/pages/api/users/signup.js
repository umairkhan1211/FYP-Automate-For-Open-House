
import { connect, disconnect } from "../../../lib/db"; // Correct the path if needed
import bcrypt from "bcrypt";
import User from "../../../models/User"; // Ensure the User model is properly imported
import { sendEmail } from "../../../Mailer/mailer"; // Correct the path if needed

export default async function signupHandler(req, res) {
  const { name, email, password, department, role, rollNumber } = req.body;


      // Basic validation for required fields
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Name, email, password, and role are required" });
      }
  
      // Role-based validation
      if (role.toLowerCase() === "student") {
        if (!rollNumber) {
          return res.status(400).json({ message: "Roll number is required for students" });
        }
        if (!department) {
          return res.status(400).json({ message: "Department is required for students" });
        }
      } else if (role.toLowerCase() === "director") {
        if (department) {
          return res
            .status(400)
            .json({ message: "Department should not be provided for directors" });
        }
        if (rollNumber) {
          return res
            .status(400)
            .json({ message: "Roll number should not be provided for directors" });
        }
      } else {
        if (!department) {
          return res.status(400).json({ message: "Department is required for non-student roles" });
        }
        if (rollNumber) {
          return res
            .status(400)
            .json({ message: "Roll number should not be provided for non-student roles" });
        }
      }
  


  try {
    await connect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    if (role.toLowerCase() === "student") {
      const existingRollNumber = await User.findOne({ rollNumber });
      if (existingRollNumber) {
        return res.status(409).json({ message: "Roll number already taken" });
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role.toLowerCase(),
      ...(role.toLowerCase() === "student" && { rollNumber }),
      ...(role.toLowerCase() !== "director" && { department }),
      createdAt: new Date(),
    });

    const savedUser = await newUser.save();

    // Optionally, send a verification email
    // await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      savedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await disconnect();
  }
}
