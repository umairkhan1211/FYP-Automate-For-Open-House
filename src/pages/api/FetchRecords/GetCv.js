import { connect } from '../../../lib/db';
import Users from '../../../models/User';
import Upload from '../../../models/Upload';

export default async function handler(req, res) {
  const { rollNumber } = req.query; // Get rollNumber from the query string

  if (!rollNumber) {
    return res.status(400).json({ message: "Roll number is required" });
  }

  await connect();

  try {
    // Find the student by rollNumber
    const student = await Users.findOne({ rollNumber });
 

if (!student) {                                           
      return res.status(404).json({ message: "Student not found" });
    }

    // Find the upload entry associated with the student's user ID
    const upload = await Upload.findOne({ user: student._id }); // Match on user (student) ID

    if (!upload) {
      if (!upload) {
        return res.status(200).json({
          cvFilePath: null,
       
        });
      }
    }

    // Return relevant data (CV, FYP Document, Video)
    return res.status(200).json({
      cvFilePath: upload.cvFilePath || null  // CV file path

    });

    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}