// src/pages/api/UploadFile/index.js
import UploadFile from "../../../models/UploadFile";
import { connect } from "../../../lib/db";

export default async function handler(req, res) {
  await connect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { uploadType } = req.query;

    if (!uploadType) {
      return res.status(400).json({ message: 'uploadType parameter is required' });
    }

    const files = await UploadFile.find({ uploadType })
      .sort({ createdAt: -1 })
      .limit(1);

    if (files.length === 0) {
      return res.status(404).json({ message: 'No template found' });
    }

    return res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}