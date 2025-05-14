// /api/FetchRecords/findFypFilePath.js

import { connect } from "../../../lib/db";
import Upload from "../../../models/Upload";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { ids } = req.body;
  console.log("api ka ander ki id " , ids)

  if (!Array.isArray(ids)) {
    return res.status(400).json({ message: "ids must be an array" });
  }

  await connect();

  const result = [];

  for (let id of ids) {
    try {
      const record = await Upload.findOne({ user: id });

      if (!record) continue;

      const hasFyp = record?.fypDocument?.filePath;
      const hasVideo = record?.videoUrl && record?.bannerImageFilePath;

      // Only return ID if any path exists
      if (hasFyp || hasVideo) {
        result.push({
          id,
          fypDocumentPath: hasFyp || null,
          videoUrl: record.videoUrl || null,
          bannerImageFilePath: record.bannerImageFilePath || null,
        });
      }
    } catch (err) {
      console.error(`Error checking ID ${id}:`, err);
    }
  }

  return res.status(200).json({ success: true, data: result });
}
