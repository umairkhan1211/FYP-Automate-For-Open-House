import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export default function handler(req, res) {
  const { filePath } = req.query;

  if (!filePath) {
    return res.status(400).json({ message: "File path is required" });
  }

  const fileLocation = path.join(process.cwd(), 'public', filePath);

  fs.stat(fileLocation, (err, stats) => {
    if (err || !stats.isFile()) {
      console.error("File not found at:", fileLocation);
      return res.status(404).json({ message: "File not found" });
    }

    const mimeType = mime.lookup(fileLocation) || 'application/octet-stream'; // ✅ detect correct type

    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(fileLocation)}"`);
    res.setHeader('Content-Type', mimeType); // ✅ use correct MIME type
    res.setHeader('Content-Length', stats.size);

    const fileStream = fs.createReadStream(fileLocation);
    fileStream.pipe(res);

    fileStream.on('error', (streamErr) => {
      console.error("Stream error:", streamErr);
      res.status(500).end("Error reading file.");
    });
  });
}
