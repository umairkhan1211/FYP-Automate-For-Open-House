import sharp from 'sharp';
import pixelmatch from 'pixelmatch';
import { promises as fs } from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

const TEMPLATE_PATH = path.join(process.cwd(), 'public', 'templates', 'cv_template.jpg');
const MATCH_THRESHOLD = 0.75; // 75% similarity

function isValidJpg(buffer) {
  // JPEG files start with FF D8 and end with FF D9
  return buffer[0] === 0xff && buffer[1] === 0xd8 &&
         buffer[buffer.length - 2] === 0xff && buffer[buffer.length - 1] === 0xd9;
}

export default async function handler(req, res) {
  let tempFilePath = '';

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (!isValidJpg(buffer)) {
      throw new Error('The uploaded file is not a valid JPG image');
    }

    tempFilePath = path.join(tmpdir(), `cv-${uuidv4()}.jpg`);
    await fs.writeFile(tempFilePath, buffer);

    await fs.access(TEMPLATE_PATH);

    const resizedWidth = 800;
    const resizedHeight = 1131;

    let template, uploaded;

    try {
      [template, uploaded] = await Promise.all([
        sharp(TEMPLATE_PATH)
          .resize(resizedWidth, resizedHeight)
          .grayscale()
          .normalize()
          .raw()
          .toBuffer({ resolveWithObject: true }),
        sharp(buffer)
          .resize(resizedWidth, resizedHeight)
          .grayscale()
          .normalize()
          .raw()
          .toBuffer({ resolveWithObject: true }),
      ]);
    } catch (error) {
      throw new Error('Error processing images');
    }

    const { data: templateData, info: templateInfo } = template;
    const { data: uploadedData } = uploaded;

    const diffPixels = pixelmatch(
      templateData,
      uploadedData,
      null,
      templateInfo.width,
      templateInfo.height,
      { threshold: 0.1 }
    );

    const totalPixels = templateInfo.width * templateInfo.height;
    const similarity = 1 - diffPixels / totalPixels;

    const isMatch = similarity >= MATCH_THRESHOLD;

    res.status(200).json({
      isMatch,
      similarity,
      message: isMatch
        ? `CV matches the template with ${Math.round(similarity * 100)}% similarity`
        : `CV does not match the template. Similarity: ${Math.round(similarity * 100)}%`,
    });
  } catch (error) {
    console.error("Validation error:", error);
    res.status(400).json({ message: error.message || 'Validation failed' });
  } finally {
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (cleanupError) {
        console.warn("Temp file cleanup failed:", cleanupError);
      }
    }
  }
}
