import path from "path";
import fs from "fs/promises";
import mime from "mime-types";

export default async function handler(req, res) {
  const { imagePath } = req.query;

  if (!imagePath) {
    return res.status(400).json({ error: "Image path is required" });
  }

  const fullPath = path.join(process.cwd(), "public", imagePath);

  try {
    const fileBuffer = await fs.readFile(fullPath);
    const contentType = mime.lookup(fullPath) || "application/octet-stream";
    const fileName = path.basename(fullPath);

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", contentType);
    res.status(200).send(fileBuffer);
  } catch (err) {
    console.error("Download error:", err.message);
    res.status(404).json({ error: "File not found or failed to read." });
  }
}
