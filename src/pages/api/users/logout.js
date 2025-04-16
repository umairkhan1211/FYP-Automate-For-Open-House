import { connect, disconnect } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") { // Ensure the request method is POST for logout
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Connect to the database (if needed, but for logout, it's usually not required)
    await connect();

    // Set the cookie to expire immediately
    res.setHeader('Set-Cookie', 'token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict');

    // Send the response with a success message
    return res.status(200).json({
      message: "Logout Successfully",
      success: true,
    });

  } catch (error) {
    console.error("Logout error:", error);
    // Return a 500 response if something goes wrong
    return res.status(500).json({ error: error.message });
  } finally {
    // Disconnect from the database if necessary
    await disconnect();
  }
}
