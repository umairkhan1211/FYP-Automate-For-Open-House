
import User from "../../../models/User";
import db from "../../../lib/db";


await db.connect()
export default async function POST(req, res) {
  try {
   
    const { token } = req.body;
    console.log(token);
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.json({ error: "Invalid Token " }, { status: 400 });
    }
    console.log(user);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return res.json(
      { message: "Email verified Successfully", success: true },
      { status: 400 }
    );
  } catch (error) {
    return res.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
