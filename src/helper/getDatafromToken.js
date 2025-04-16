import jwt from "jsonwebtoken";


export default async function getDatafromToken(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        return { id: decodedToken.id, error: null };
    } catch (error) {
        return { id: null, error: error.message };
    }
}
