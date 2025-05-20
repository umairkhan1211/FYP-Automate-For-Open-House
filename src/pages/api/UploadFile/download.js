// pages/api/download.js
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { filePath } = req.query;

  if (!filePath) {
    return res.status(400).json({ message: 'File path is required' });
  }

  try {
    const filePathOnDisk = path.join(process.cwd(), 'public', filePath);
    const fileBuffer = await fs.readFile(filePathOnDisk);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);
    
    return res.send(fileBuffer);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(404).json({ message: 'File not found' });
  }
}