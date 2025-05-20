import sharp from 'sharp';
import { createHash } from 'crypto';
import busboy from 'busboy';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const formData = {};
    const bb = busboy({ headers: req.headers });

    bb.on('file', (fieldname, file, info) => {
      const { filename, encoding, mimeType } = info;
      const chunks = [];
      
      file.on('data', (chunk) => chunks.push(chunk));
      file.on('end', () => {
        formData[fieldname] = {
          buffer: Buffer.concat(chunks),
          filename,
          mimetype: mimeType,
        };
      });
    });

    bb.on('error', (err) => reject(err));
    bb.on('finish', () => resolve(formData));

    req.pipe(bb);
  });
}

async function validateImage(buffer) {
  try {
    const metadata = await sharp(buffer).metadata();
    if (!metadata.format || !['jpeg', 'png', 'jpg'].includes(metadata.format.toLowerCase())) {
      throw new Error(`Unsupported image format: ${metadata.format}`);
    }
    return true;
  } catch (error) {
    console.error('Image validation failed:', error);
    throw new Error('Invalid image file. Please upload a valid JPG/PNG image.');
  }
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const formData = await parseMultipartForm(req);
    
    // Validate files exist
    if (!formData.template || !formData.studentCV) {
      return res.status(400).json({ message: 'Both template and student CV files are required' });
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(formData.template.mimetype.toLowerCase()) || 
        !validTypes.includes(formData.studentCV.mimetype.toLowerCase())) {
      return res.status(400).json({ message: 'Only JPG/PNG images are supported' });
    }

    // Check for identical files
    const templateHash = createHash('sha256').update(formData.template.buffer).digest('hex');
    const studentHash = createHash('sha256').update(formData.studentCV.buffer).digest('hex');
    
    if (templateHash === studentHash) {
      return res.status(200).json({
        similarity: 100,
        isMatch: true,
        templateType: 'identical',
        details: {
          layout: 100,
          sections: 100,
          structure: 100,
          content: 100,
          style: 100,
        },
      });
    }

    // Preprocess images
    const processedTemplate = await preprocessImage(formData.template.buffer);
    const processedStudent = await preprocessImage(formData.studentCV.buffer);

    // Perform comprehensive comparison
    const {
      layoutScore,
      sectionScore,
      structureScore,
      contentScore,
      styleScore,
      overallSimilarity,
      templateType
    } = await comprehensiveCompare(processedTemplate, processedStudent);

    const isMatch = overallSimilarity >= 0.85;

    return res.status(200).json({
      similarity: Math.round(overallSimilarity * 100),
      isMatch,
      templateType,
      details: {
        layout: Math.round(layoutScore * 100),
        sections: Math.round(sectionScore * 100),
        structure: Math.round(structureScore * 100),
        content: Math.round(contentScore * 100),
        style: Math.round(styleScore * 100),
      },
    });

  } catch (error) {
    console.error('Error comparing documents:', error);
    return res.status(500).json({
      message: error.message || 'Internal server error during comparison',
    });
  }
}

// ===== Enhanced Comparison Functions =====

async function preprocessImage(buffer) {
  try {
    // First validate the image
    const metadata = await sharp(buffer).metadata();
    if (!metadata.format || !['jpeg', 'png', 'jpg'].includes(metadata.format.toLowerCase())) {
      throw new Error(`Unsupported image format: ${metadata.format}`);
    }

    return await sharp(buffer)
      .grayscale()
      .resize(800, 1120, { fit: 'fill' })
      .normalise()
      .linear(1.2, -(128 * 0.2))
      .sharpen()
      .toBuffer();
  } catch (error) {
    console.error('Image preprocessing error:', error);
    throw new Error('Invalid image file. Please upload a valid JPG/PNG image.');
  }
}

async function comprehensiveCompare(templateBuffer, studentBuffer) {
  // Detect template type first
  const templateType = await detectTemplateType(templateBuffer);
  
  // Run all analyses in parallel
  const [
    layoutScore,
    sectionScore,
    structureScore,
    contentScore,
    styleScore
  ] = await Promise.all([
    analyzeLayoutStructure(templateBuffer, studentBuffer),
    analyzeSections(templateBuffer, studentBuffer, templateType),
    analyzeDocumentStructure(templateBuffer, studentBuffer),
    analyzeContentFeatures(templateBuffer, studentBuffer),
    analyzeVisualStyle(templateBuffer, studentBuffer)
  ]);

  // Dynamic weighting based on template type
  const weights = templateType === 'organizational' ? {
    layout: 0.35,
    sections: 0.25,
    structure: 0.2,
    content: 0.1,
    style: 0.1
  } : {
    layout: 0.2,
    sections: 0.25,
    structure: 0.25,
    content: 0.2,
    style: 0.1
  };

  // Calculate weighted overall similarity
  const overallSimilarity = 
    layoutScore * weights.layout +
    sectionScore * weights.sections +
    structureScore * weights.structure +
    contentScore * weights.content +
    styleScore * weights.style;

  return {
    layoutScore,
    sectionScore,
    structureScore,
    contentScore,
    styleScore,
    overallSimilarity,
    templateType
  };
}

async function detectTemplateType(buffer) {
  const { data, info } = await sharp(buffer)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  
  // Calculate text density and layout complexity
  let darkPixels = 0;
  let transitions = 0;
  let prevPixel = data[0];
  
  for (let i = 0; i < data.length; i++) {
    if (data[i] < 128) darkPixels++;
    if (Math.abs(data[i] - prevPixel) > 50) transitions++;
    prevPixel = data[i];
  }
  
  const textDensity = darkPixels / (width * height);
  const complexity = transitions / (width * height);
  
  // Organizational templates typically have:
  // - Higher text density (>15%)
  // - More complex layouts
  // - Multiple columns
  return textDensity > 0.15 && complexity > 0.2 ? 'organizational' : 'student';
}

async function analyzeLayoutStructure(img1Buffer, img2Buffer) {
  const { data: img1 } = await sharp(img1Buffer)
    .threshold(128)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { data: img2 } = await sharp(img2Buffer)
    .threshold(128)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Calculate horizontal and vertical projections
  const proj1 = calculateProjections(img1);
  const proj2 = calculateProjections(img2);

  // Compare projections
  const hDiff = compareProjections(proj1.horizontal, proj2.horizontal);
  const vDiff = compareProjections(proj1.vertical, proj2.vertical);

  // Detect multi-column layouts
  const cols1 = detectColumns(proj1.vertical);
  const cols2 = detectColumns(proj2.vertical);
  const colScore = cols1 === cols2 ? 1 : 0.5;

  return (1 - (hDiff + vDiff) / 2) * 0.8 + colScore * 0.2;
}

function calculateProjections(imageData, width = 800, height = 1120) {
  const horizontal = new Array(height).fill(0);
  const vertical = new Array(width).fill(0);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (imageData[i] < 128) {
        horizontal[y]++;
        vertical[x]++;
      }
    }
  }

  return { horizontal, vertical };
}

function detectColumns(verticalProjection, width = 800) {
  const threshold = Math.max(...verticalProjection) * 0.3;
  let columnEdges = [];
  let inColumn = false;

  for (let x = 0; x < width; x++) {
    if (verticalProjection[x] > threshold) {
      if (!inColumn) {
        columnEdges.push(x);
        inColumn = true;
      }
    } else {
      if (inColumn) {
        columnEdges.push(x);
        inColumn = false;
      }
    }
  }

  // Count columns based on edges
  return Math.ceil(columnEdges.length / 2);
}

function compareProjections(proj1, proj2) {
  const length = Math.min(proj1.length, proj2.length);
  let diff = 0;
  
  for (let i = 0; i < length; i++) {
    diff += Math.abs(proj1[i] - proj2[i]);
  }
  
  const maxDiff = 800 * length;
  return diff / maxDiff;
}

async function analyzeSections(templateBuffer, studentBuffer, templateType) {
  // Define different section expectations based on template type
  const sections = templateType === 'organizational' ? [
    { name: 'header', minHeight: 50, maxHeight: 120, searchArea: { top: 0, height: 150 } },
    { name: 'summary', minHeight: 30, maxHeight: 80, searchArea: { top: 150, height: 100 } },
    { name: 'experience', minHeight: 150, maxHeight: 300, searchArea: { top: 250, height: 350 } },
    { name: 'education', minHeight: 100, maxHeight: 200, searchArea: { top: 600, height: 200 } },
    { name: 'skills', minHeight: 80, maxHeight: 180, searchArea: { top: 800, height: 200 } }
  ] : [
    { name: 'header', minHeight: 80, maxHeight: 150, searchArea: { top: 0, height: 200 } },
    { name: 'education', minHeight: 150, maxHeight: 300, searchArea: { top: 200, height: 300 } },
    { name: 'projects', minHeight: 200, maxHeight: 400, searchArea: { top: 400, height: 400 } },
    { name: 'skills', minHeight: 100, maxHeight: 200, searchArea: { top: 700, height: 200 } }
  ];

  let totalScore = 0;
  let matched = 0;

  for (const section of sections) {
    const tSec = await detectSection(templateBuffer, section);
    const sSec = await detectSection(studentBuffer, section);
    
    if (tSec && sSec) {
      // Position similarity (weighted more heavily)
      const positionScore = 1 - Math.abs(tSec.top - sSec.top) / 1120;
      
      // Size similarity
      const sizeScore = 1 - (
        Math.abs(tSec.width - sSec.width) / 800 +
        Math.abs(tSec.height - sSec.height) / 1120
      ) / 2;

      // Combined score for this section
      totalScore += (positionScore * 0.7) + (sizeScore * 0.3);
      matched++;
    }
  }

  return matched > 0 ? totalScore / matched : 0;
}

async function detectSection(imgBuffer, def) {
  const { data, info } = await sharp(imgBuffer)
    .extract({
      left: 0,
      top: def.searchArea.top,
      width: 800,
      height: def.searchArea.height,
    })
    .threshold(128)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const density = new Array(height).fill(0);

  // Calculate row densities
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[y * width + x] < 128) {
        density[y]++;
      }
    }
  }

  // Find section boundaries
  let top = 0, bottom = 0;
  let inSection = false;
  let maxDensity = 0;
  
  for (let y = 0; y < height; y++) {
    if (density[y] > width * 0.1) {
      if (!inSection) {
        top = y;
        inSection = true;
      }
      bottom = y;
      if (density[y] > maxDensity) maxDensity = density[y];
    }
  }

  const sectionHeight = bottom - top + 1;
  if (sectionHeight >= def.minHeight && sectionHeight <= def.maxHeight) {
    // Estimate section width based on density
    let left = 0, right = width - 1;
    while (left < width && density[Math.floor(top + sectionHeight/2)] < maxDensity * 0.3) left++;
    while (right > 0 && density[Math.floor(top + sectionHeight/2)] < maxDensity * 0.3) right--;
    
    return {
      top: def.searchArea.top + top,
      left: Math.max(0, left - 10),
      width: Math.min(width, right - left + 20),
      height: sectionHeight,
    };
  }

  return null;
}

async function analyzeDocumentStructure(templateBuffer, studentBuffer) {
  // Analyze overall document structure including whitespace distribution
  const templateFeatures = await extractStructuralFeatures(templateBuffer);
  const studentFeatures = await extractStructuralFeatures(studentBuffer);
  
  let score = 0;
  
  // 1. Compare whitespace distribution
  score += (1 - Math.abs(templateFeatures.whitespaceRatio - studentFeatures.whitespaceRatio)) * 0.4;
  
  // 2. Compare margin sizes
  score += (1 - (
    Math.abs(templateFeatures.margins.left - studentFeatures.margins.left) / 800 +
    Math.abs(templateFeatures.margins.top - studentFeatures.margins.top) / 1120
  ) / 2) * 0.3;
  
  // 3. Compare paragraph spacing consistency
  if (Math.abs(templateFeatures.paragraphSpacing - studentFeatures.paragraphSpacing) < 5) {
    score += 0.3;
  }
  
  return score;
}

async function extractStructuralFeatures(buffer) {
  const { data, info } = await sharp(buffer)
    .grayscale()
    .threshold(128)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  
  // Calculate whitespace ratio
  let darkPixels = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] < 128) darkPixels++;
  }
  const whitespaceRatio = 1 - (darkPixels / (width * height));
  
  // Estimate margins
  let leftMargin = width, rightMargin = width;
  let topMargin = height, bottomMargin = height;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[y * width + x] < 128) {
        if (x < leftMargin) leftMargin = x;
        if (x > width - rightMargin) rightMargin = width - x;
        if (y < topMargin) topMargin = y;
        if (y > height - bottomMargin) bottomMargin = height - y;
      }
    }
  }
  
  // Estimate paragraph spacing (simplified)
  const { horizontal } = calculateProjections(data, width, height);
  let spacingCounts = {};
  let prevTextLine = -100;
  
  for (let y = 0; y < height; y++) {
    if (horizontal[y] > width * 0.1) {
      const spacing = y - prevTextLine;
      if (spacing > 10 && spacing < 50) {
        spacingCounts[spacing] = (spacingCounts[spacing] || 0) + 1;
      }
      prevTextLine = y;
    }
  }
  
  let paragraphSpacing = 0;
  if (Object.keys(spacingCounts).length > 0) {
    paragraphSpacing = parseInt(
      Object.entries(spacingCounts).sort((a, b) => b[1] - a[1])[0][0]
    );
  }
  
  return {
    whitespaceRatio,
    margins: {
      left: leftMargin,
      right: rightMargin,
      top: topMargin,
      bottom: bottomMargin
    },
    paragraphSpacing
  };
}

async function analyzeContentFeatures(templateBuffer, studentBuffer) {
  const templateFeatures = await extractContentFeatures(templateBuffer);
  const studentFeatures = await extractContentFeatures(studentBuffer);
  
  let score = 0;
  
  // 1. Compare presence of key sections
  if (templateFeatures.hasContactInfo === studentFeatures.hasContactInfo) score += 0.2;
  if (templateFeatures.hasSummary === studentFeatures.hasSummary) score += 0.2;
  
  // 2. Compare section ordering
  const orderSimilarity = compareSectionOrder(
    templateFeatures.sections, 
    studentFeatures.sections
  );
  score += orderSimilarity * 0.3;
  
  // 3. Compare text density
  score += (1 - Math.abs(templateFeatures.textDensity - studentFeatures.textDensity)) * 0.2;
  
  // 4. Compare line spacing style
  if (templateFeatures.usesSingleLineSpacing === studentFeatures.usesSingleLineSpacing) score += 0.1;
  
  return score;
}

async function extractContentFeatures(buffer) {
  const { data, info } = await sharp(buffer)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  
  // Calculate text density
  let darkPixels = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] < 128) darkPixels++;
  }
  const textDensity = darkPixels / (width * height);
  
  // Detect common sections
  let hasContactInfo = false;
  let hasSummary = false;
  let sections = [];
  
  // Check top 150px for contact info (high density of text)
  let topDensity = 0;
  for (let y = 0; y < 150; y++) {
    for (let x = 0; x < width; x++) {
      if (data[y * width + x] < 128) topDensity++;
    }
  }
  hasContactInfo = topDensity > (width * 150 * 0.15);
  
  // Check for summary section (medium density below contact info)
  let summaryDensity = 0;
  for (let y = 150; y < 300; y++) {
    for (let x = 0; x < width; x++) {
      if (data[y * width + x] < 128) summaryDensity++;
    }
  }
  hasSummary = summaryDensity > (width * 150 * 0.1) && 
                summaryDensity < (width * 150 * 0.25);
  
  // Detect line spacing (simplified)
  const { horizontal } = calculateProjections(data, width, height);
  let lineSpacings = [];
  let prevLine = -1;
  
  for (let y = 0; y < height; y++) {
    if (horizontal[y] > width * 0.1) {
      if (prevLine !== -1) {
        lineSpacings.push(y - prevLine);
      }
      prevLine = y;
    }
  }
  
  const avgLineSpacing = lineSpacings.length > 0 ? 
    lineSpacings.reduce((a, b) => a + b, 0) / lineSpacings.length : 0;
  const usesSingleLineSpacing = avgLineSpacing < 20;
  
  return {
    hasContactInfo,
    hasSummary,
    textDensity,
    usesSingleLineSpacing,
    sections: ['header', 'education', 'experience', 'skills'] // Simplified for demo
  };
}

function compareSectionOrder(sections1, sections2) {
  // Simple order comparison - count matching sections in same order
  let matches = 0;
  const minLength = Math.min(sections1.length, sections2.length);
  
  for (let i = 0; i < minLength; i++) {
    if (sections1[i] === sections2[i]) matches++;
  }
  
  return matches / Math.max(sections1.length, sections2.length);
}

async function analyzeVisualStyle(templateBuffer, studentBuffer) {
  const templateStyle = await extractVisualStyle(templateBuffer);
  const studentStyle = await extractVisualStyle(studentBuffer);
  
  let score = 0;
  
  // 1. Compare use of borders/boxes
  if (templateStyle.usesBoxes === studentStyle.usesBoxes) score += 0.3;
  
  // 2. Compare header style
  if (templateStyle.hasCenteredHeader === studentStyle.hasCenteredHeader) score += 0.2;
  
  // 3. Compare bullet point style
  if (templateStyle.usesBulletPoints === studentStyle.usesBulletPoints) score += 0.2;
  
  // 4. Compare font weight distribution
  score += (1 - Math.abs(templateStyle.boldDensity - studentStyle.boldDensity)) * 0.3;
  
  return score;
}

async function extractVisualStyle(buffer) {
  try {
    const { data, info } = await sharp(buffer)
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;
    
    // Detect boxes/borders (looking for rectangular patterns)
    let usesBoxes = false;
    let hasCenteredHeader = false;
    let usesBulletPoints = false;
    let boldDensity = 0;
    
    // Check if there are horizontal lines in the header
    const headerLines = await detectLines(buffer, { top: 0, height: 100 });
    usesBoxes = headerLines.horizontal.length > 1;
    
    // Check if header text is centered
    const headerText = await detectTextAlignment(buffer, { top: 0, height: 100 });
    hasCenteredHeader = headerText === 'center';
    
    // Check for bullet points in first content section
    const contentPattern = await detectBulletPoints(buffer, { top: 150, height: 200 });
    usesBulletPoints = contentPattern.found;
    
    // Estimate bold density (more dark pixels in text areas)
    let textPixels = 0;
    let darkPixels = 0;
    for (let y = 100; y < height - 100; y++) {
      for (let x = 100; x < width - 100; x++) {
        if (data[y * width + x] < 192) {
          textPixels++;
          if (data[y * width + x] < 64) darkPixels++;
        }
      }
    }
    boldDensity = textPixels > 0 ? darkPixels / textPixels : 0;
    
    return {
      usesBoxes,
      hasCenteredHeader,
      usesBulletPoints,
      boldDensity
    };
  } catch (error) {
    console.error('Error in extractVisualStyle:', error);
    return {
      usesBoxes: false,
      hasCenteredHeader: false,
      usesBulletPoints: false,
      boldDensity: 0
    };
  }
}


// Helper function to detect lines (simplified)
async function detectLines(buffer, area = { left: 0, top: 0, width: 800, height: 1120 }) {
  try {
    // Ensure area values are within bounds and have defaults
    const width = 800;
    const height = 1120;
    
    const extractArea = {
      left: Math.max(0, Math.min(area.left || 0, width - 1)),
      top: Math.max(0, Math.min(area.top || 0, height - 1)),
      width: Math.max(1, Math.min(area.width || width, width - (area.left || 0))),
      height: Math.max(1, Math.min(area.height || height, height - (area.top || 0)))
    };

    const { data, info } = await sharp(buffer)
      .extract(extractArea)
      .threshold(128)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const areaWidth = info.width;
    const areaHeight = info.height;
    
    const horizontalLines = [];
    const verticalLines = [];
    
    // Detect horizontal lines (rows where >80% of pixels are dark)
    for (let y = 0; y < areaHeight; y++) {
      let darkCount = 0;
      for (let x = 0; x < areaWidth; x++) {
        if (data[y * areaWidth + x] < 128) darkCount++;
      }
      if (darkCount > areaWidth * 0.8) {
        horizontalLines.push(y + extractArea.top); // Store absolute position
      }
    }
    
    // Detect vertical lines (columns where >80% of pixels are dark)
    for (let x = 0; x < areaWidth; x++) {
      let darkCount = 0;
      for (let y = 0; y < areaHeight; y++) {
        if (data[y * areaWidth + x] < 128) darkCount++;
      }
      if (darkCount > areaHeight * 0.8) {
        verticalLines.push(x + extractArea.left); // Store absolute position
      }
    }
    
    return {
      horizontal: horizontalLines,
      vertical: verticalLines
    };
  } catch (error) {
    console.error('Error in detectLines:', error);
    return {
      horizontal: [],
      vertical: []
    };
  }
}

// Helper function to detect text alignment
async function detectTextAlignment(buffer, area) {
  const { data, info } = await sharp(buffer)
    .extract(area)
    .threshold(128)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  
  let leftDensity = 0;
  let centerDensity = 0;
  let rightDensity = 0;
  
  // Calculate density in different regions
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[y * width + x] < 128) {
        if (x < width/3) leftDensity++;
        else if (x > width*2/3) rightDensity++;
        else centerDensity++;
      }
    }
  }
  
  const maxDensity = Math.max(leftDensity, centerDensity, rightDensity);
  if (maxDensity === leftDensity) return 'left';
  if (maxDensity === rightDensity) return 'right';
  return 'center';
}

// Helper function to detect bullet points
async function detectBulletPoints(buffer, area) {
  const { data, info } = await sharp(buffer)
    .extract(area)
    .threshold(128)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  
  // Look for small circular patterns in the left margin
  let bulletCandidates = 0;
  const margin = width * 0.1;
  
  for (let y = 0; y < height; y += 5) {
    for (let x = 0; x < margin; x += 5) {
      if (data[y * width + x] < 128) {
        // Check if this might be a bullet (small cluster)
        let clusterSize = 0;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              if (data[ny * width + nx] < 128) clusterSize++;
            }
          }
        }
        if (clusterSize > 5) bulletCandidates++;
      }
    }
  }
  
  return {
    found: bulletCandidates > 3,
    count: bulletCandidates
  };
}




