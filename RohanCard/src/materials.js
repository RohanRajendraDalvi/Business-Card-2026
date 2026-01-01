// ============================================================================
// MATERIALS, PATTERNS & LOGO CONFIGURATION
// Separate from color themes - controls textures, patterns, logos, and 3D materials
// ============================================================================

// ============================================================================
// LOGO / ICON SETTINGS
// ============================================================================

export const logoSettings = {
  // === LOGO SOURCE ===
  // Options: 'none', 'custom', 'glasses', 'laptop', 'hardhat', 'medical', 'building', 'code', 'gear', 'briefcase'
  source: 'glasses',
  
  // === CUSTOM LOGO PATH ===
  // Only used if source is 'custom'
  // Path to your logo image (will be converted to silhouette)
  customLogoPath: '/src/assets/logo.png',
  
  // === POSITIONING (Portrait mode - back card) ===
  portrait: {
    x: 420,
    y: 110,
    size: 260,
  },
  
  // === POSITIONING (Landscape mode - back card) ===
  landscape: {
    x: 680,
    y: 100,
    size: 400,
  },
  
  // === SILHOUETTE SETTINGS ===
  opacity: 0.5,           // 0.0 - 1.0
  useThemeColor: true,    // true = use theme's glassesColor, false = use customColor
  customColor: '#00d4ff', // Only used if useThemeColor is false
};

// ============================================================================
// PRESET ICON DRAWING FUNCTIONS
// All icons normalized to fit within a consistent bounding box
// Each takes: (ctx, x, y, size, strokeColor, fillColor)
// ============================================================================

export const iconPresets = {
  // Glasses icon (default) - reference positioning
  glasses: (ctx, x, y, size, strokeColor, fillColor) => {
    const scale = size / 280;
    ctx.save();
    ctx.translate(x, y + 55 * scale); // Moved lower
    ctx.scale(scale, scale);
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(0, 0, 120, 60, 12);
    ctx.roundRect(140, 0, 120, 60, 12);
    ctx.moveTo(120, 30);
    ctx.lineTo(140, 30);
    ctx.stroke();
    
    ctx.fillStyle = fillColor;
    ctx.fillRect(10, 10, 100, 40);
    ctx.fillRect(150, 10, 100, 40);
    
    ctx.restore();
  },

  // Laptop icon - made smaller
  laptop: (ctx, x, y, size, strokeColor, fillColor) => {
    const scale = size / 350; // Increased divisor = smaller icon
    ctx.save();
    ctx.translate(x + 20 * scale, y + 15 * scale); // Moved higher
    ctx.scale(scale, scale);
    
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = 5;
    
    // Screen
    ctx.beginPath();
    ctx.roundRect(20, 0, 240, 130, 8);
    ctx.stroke();
    ctx.fillRect(30, 10, 220, 110);
    
    // Base
    ctx.beginPath();
    ctx.moveTo(0, 140);
    ctx.lineTo(280, 140);
    ctx.lineTo(260, 160);
    ctx.lineTo(20, 160);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    
    // Screen shine
    ctx.strokeStyle = strokeColor;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(50, 30);
    ctx.lineTo(80, 30);
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    ctx.restore();
  },

  // Hard hat / Construction icon - reference positioning
  hardhat: (ctx, x, y, size, strokeColor, fillColor) => {
    const scale = size / 280;
    ctx.save();
    ctx.translate(x, y + 55 * scale); // Moved lower
    ctx.scale(scale, scale);
    
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = 5;
    
    // Hat dome
    ctx.beginPath();
    ctx.ellipse(140, 30, 120, 50, 0, Math.PI, 0);
    ctx.stroke();
    ctx.fill();
    
    // Brim
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(280, 30);
    ctx.lineTo(260, 55);
    ctx.lineTo(20, 55);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    
    // Center ridge
    ctx.beginPath();
    ctx.moveTo(140, -20);
    ctx.lineTo(140, 30);
    ctx.stroke();
    
    ctx.restore();
  },

  // Medical / Healthcare icon
  medical: (ctx, x, y, size, strokeColor, fillColor) => {
    const scale = size / 280;
    ctx.save();
    ctx.translate(x, y + 5 * scale); // Moved higher
    ctx.scale(scale, scale);
    
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = 5;
    
    // Cross - centered
    ctx.beginPath();
    ctx.roundRect(105, 0, 70, 120, 8);
    ctx.stroke();
    ctx.fill();
    
    ctx.beginPath();
    ctx.roundRect(50, 35, 180, 55, 8);
    ctx.stroke();
    ctx.fill();
    
    ctx.restore();
  },

  // Office building icon
  building: (ctx, x, y, size, strokeColor, fillColor) => {
    const scale = size / 280;
    ctx.save();
    ctx.translate(x, y); // Moved higher
    ctx.scale(scale, scale);
    
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = 5;
    
    // Main building
    ctx.beginPath();
    ctx.rect(50, 0, 180, 130);
    ctx.stroke();
    ctx.fill();
    
    // Windows
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.strokeRect(70 + col * 50, 15 + row * 35, 30, 22);
      }
    }
    
    // Door
    ctx.beginPath();
    ctx.roundRect(115, 100, 50, 30, [8, 8, 0, 0]);
    ctx.stroke();
    
    ctx.restore();
  },

  // Code brackets icon
  code: (ctx, x, y, size, strokeColor, fillColor) => {
    const scale = size / 280;
    ctx.save();
    ctx.translate(x, y + 5 * scale); // Moved higher
    ctx.scale(scale, scale);
    
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    // Left bracket <
    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.lineTo(30, 60);
    ctx.lineTo(80, 120);
    ctx.stroke();
    
    // Right bracket >
    ctx.beginPath();
    ctx.moveTo(200, 0);
    ctx.lineTo(250, 60);
    ctx.lineTo(200, 120);
    ctx.stroke();
    
    // Slash /
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(160, -5);
    ctx.lineTo(120, 125);
    ctx.stroke();
    
    ctx.restore();
  },

  // Gear / Settings icon
  gear: (ctx, x, y, size, strokeColor, fillColor) => {
    const scale = size / 280;
    ctx.save();
    ctx.translate(x, y + 10 * scale); // Moved higher
    ctx.scale(scale, scale);
    
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = 5;
    
    const cx = 140, cy = 55;
    const outerR = 50, innerR = 28, toothH = 15;
    const teeth = 8;
    
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const angle1 = (i / teeth) * Math.PI * 2;
      const angle2 = ((i + 0.3) / teeth) * Math.PI * 2;
      const angle3 = ((i + 0.5) / teeth) * Math.PI * 2;
      const angle4 = ((i + 0.8) / teeth) * Math.PI * 2;
      
      ctx.lineTo(cx + Math.cos(angle1) * outerR, cy + Math.sin(angle1) * outerR);
      ctx.lineTo(cx + Math.cos(angle2) * (outerR + toothH), cy + Math.sin(angle2) * (outerR + toothH));
      ctx.lineTo(cx + Math.cos(angle3) * (outerR + toothH), cy + Math.sin(angle3) * (outerR + toothH));
      ctx.lineTo(cx + Math.cos(angle4) * outerR, cy + Math.sin(angle4) * outerR);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    
    // Center hole
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  },

  // Briefcase icon
  briefcase: (ctx, x, y, size, strokeColor, fillColor) => {
    const scale = size / 280;
    ctx.save();
    ctx.translate(x, y + 10 * scale); // Moved higher
    ctx.scale(scale, scale);
    
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = 5;
    
    // Main case
    ctx.beginPath();
    ctx.roundRect(20, 30, 240, 90, 12);
    ctx.stroke();
    ctx.fill();
    
    // Handle
    ctx.beginPath();
    ctx.roundRect(100, 0, 80, 38, 8);
    ctx.stroke();
    
    // Clasp
    ctx.beginPath();
    ctx.roundRect(120, 60, 40, 25, 4);
    ctx.stroke();
    
    ctx.restore();
  },

  // No icon
  none: () => {}
};

// ============================================================================
// SILHOUETTE CONVERSION FUNCTION
// Converts an image to a single-color silhouette
// ============================================================================

export function createSilhouette(img, tintColor, opacity = 0.5) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Limit size for performance
  const maxSize = 256;
  const scale = Math.min(1, maxSize / Math.max(img.width || img.naturalWidth, img.height || img.naturalHeight));
  canvas.width = Math.floor((img.width || img.naturalWidth) * scale);
  canvas.height = Math.floor((img.height || img.naturalHeight) * scale);
  
  // Draw scaled image
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Parse hex color to RGB
  let r, g, b;
  if (tintColor.startsWith('#')) {
    r = parseInt(tintColor.slice(1, 3), 16);
    g = parseInt(tintColor.slice(3, 5), 16);
    b = parseInt(tintColor.slice(5, 7), 16);
  } else if (tintColor.startsWith('rgba') || tintColor.startsWith('rgb')) {
    const matches = tintColor.match(/[\d.]+/g);
    r = parseInt(matches[0]);
    g = parseInt(matches[1]);
    b = parseInt(matches[2]);
  } else {
    r = g = b = 128;
  }
  
  // Sample corners for background detection
  const samplePixel = (x, y) => {
    const i = (y * canvas.width + x) * 4;
    return { r: data[i], g: data[i+1], b: data[i+2], a: data[i+3] };
  };
  
  const corners = [
    samplePixel(0, 0),
    samplePixel(canvas.width - 1, 0),
    samplePixel(0, canvas.height - 1),
    samplePixel(canvas.width - 1, canvas.height - 1)
  ];
  
  const bgR = (corners[0].r + corners[1].r + corners[2].r + corners[3].r) >> 2;
  const bgG = (corners[0].g + corners[1].g + corners[2].g + corners[3].g) >> 2;
  const bgB = (corners[0].b + corners[1].b + corners[2].b + corners[3].b) >> 2;
  const bgA = (corners[0].a + corners[1].a + corners[2].a + corners[3].a) >> 2;
  
  const colorThreshold = 2500; // squared threshold for speed
  const opacityByte = Math.floor(255 * opacity);
  
  for (let i = 0; i < data.length; i += 4) {
    const pixA = data[i + 3];
    if (pixA < 30) {
      data[i + 3] = 0;
      continue;
    }
    
    const dr = data[i] - bgR;
    const dg = data[i + 1] - bgG;
    const db = data[i + 2] - bgB;
    const colorDistSq = dr * dr + dg * dg + db * db;
    
    const isLogo = bgA < 128 ? (pixA > 30) : (colorDistSq > colorThreshold);
    
    if (isLogo) {
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = opacityByte;
    } else {
      data[i + 3] = 0;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Draw logo/icon on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} mode - 'portrait' or 'landscape'
 * @param {string} strokeColor - Theme stroke color
 * @param {string} fillColor - Theme fill color
 * @param {HTMLImageElement|null} customLogoImg - Loaded custom logo image (if source is 'custom')
 */
export function drawLogo(ctx, mode, strokeColor, fillColor, customLogoImg = null) {
  const settings = logoSettings;
  const pos = mode === 'portrait' ? settings.portrait : settings.landscape;
  
  if (settings.source === 'none') {
    return;
  }
  
  if (settings.source === 'custom' && customLogoImg) {
    // Draw custom logo as silhouette
    const tintColor = settings.useThemeColor ? strokeColor : settings.customColor;
    const silhouette = createSilhouette(customLogoImg, tintColor, settings.opacity);
    
    // Calculate aspect ratio to fit within size
    const aspectRatio = silhouette.width / silhouette.height;
    let drawW, drawH;
    if (aspectRatio > 1) {
      drawW = pos.size;
      drawH = pos.size / aspectRatio;
    } else {
      drawH = pos.size;
      drawW = pos.size * aspectRatio;
    }
    
    // Custom logos drawn higher (y - 110)
    ctx.drawImage(silhouette, pos.x, pos.y - 110, drawW, drawH);
  } else if (iconPresets[settings.source]) {
    // Draw preset icon
    iconPresets[settings.source](ctx, pos.x, pos.y, pos.size, strokeColor, fillColor);
  }
}

/**
 * Get list of available icon preset names
 */
export function getIconNames() {
  return Object.keys(iconPresets);
}

// ============================================================================
// PATTERN DRAWING FUNCTIONS
// Each pattern takes: (ctx, width, height, spacing, color)
// ============================================================================

export const patterns = {
  // Grid pattern - evenly spaced horizontal and vertical lines
  grid: (ctx, w, h, spacing, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += spacing) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
    for (let i = 0; i < h; i += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(w, i);
      ctx.stroke();
    }
  },

  // Dots pattern - evenly spaced circular dots
  dots: (ctx, w, h, spacing, color) => {
    ctx.fillStyle = color;
    for (let x = spacing / 2; x < w; x += spacing) {
      for (let y = spacing / 2; y < h; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  // Hexagons pattern - honeycomb style grid
  hexagons: (ctx, w, h, spacing, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    const size = spacing / 2;
    const hDist = size * Math.sqrt(3);
    const vDist = size * 1.5;

    for (let row = 0; row * vDist < h + size; row++) {
      for (let col = 0; col * hDist < w + size; col++) {
        const x = col * hDist + (row % 2 === 1 ? hDist / 2 : 0);
        const y = row * vDist;
        drawHexagon(ctx, x, y, size);
      }
    }
  },

  // Waves pattern - horizontal sinusoidal waves
  waves: (ctx, w, h, spacing, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let y = spacing; y < h; y += spacing) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 5) {
        const yOffset = Math.sin(x * 0.03) * (spacing * 0.3);
        if (x === 0) ctx.moveTo(x, y + yOffset);
        else ctx.lineTo(x, y + yOffset);
      }
      ctx.stroke();
    }
  },

  // Diagonal lines pattern - 45 degree lines
  diagonals: (ctx, w, h, spacing, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    const totalDist = w + h;
    for (let i = -h; i < totalDist; i += spacing) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
  },

  // Crosshatch pattern - overlapping diagonal lines
  crosshatch: (ctx, w, h, spacing, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    const totalDist = w + h;
    // Forward diagonals
    for (let i = -h; i < totalDist; i += spacing) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
    // Backward diagonals
    for (let i = 0; i < totalDist; i += spacing) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i - h, h);
      ctx.stroke();
    }
  },

  // Circuit pattern - deterministic tech-looking lines with nodes (seeded for consistency)
  circuit: (ctx, w, h, spacing, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    const count = Math.floor((w * h) / (spacing * spacing * 15));
    // Use deterministic positions based on index
    for (let i = 0; i < count; i++) {
      const seed = i * 1.618033988749;
      const x = (seed * 137.5) % w;
      const y = (seed * 97.3) % h;
      const len = spacing * 0.8;
      const dir = (i % 4) * 0.25;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len * (dir - 0.5), y);
      ctx.lineTo(x + len * (dir - 0.5), y + len * ((i % 3) * 0.3 - 0.3));
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  // Squares pattern - offset square grid
  squares: (ctx, w, h, spacing, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    const size = spacing * 0.6;
    for (let x = spacing / 2; x < w; x += spacing) {
      for (let y = spacing / 2; y < h; y += spacing) {
        ctx.strokeRect(x - size / 2, y - size / 2, size, size);
      }
    }
  },

  // Triangles pattern - tessellating triangles
  triangles: (ctx, w, h, spacing, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    const triH = spacing * Math.sqrt(3) / 2;
    
    for (let row = 0; row * triH < h + triH; row++) {
      for (let col = 0; col * spacing < w + spacing; col++) {
        const x = col * spacing + (row % 2 === 1 ? spacing / 2 : 0);
        const y = row * triH;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + spacing / 2, y + triH);
        ctx.lineTo(x - spacing / 2, y + triH);
        ctx.closePath();
        ctx.stroke();
      }
    }
  },

  // Noise/static pattern - deterministic scattered dots
  noise: (ctx, w, h, spacing, color) => {
    ctx.fillStyle = color;
    const density = Math.floor((w * h) / (spacing * spacing * 2));
    for (let i = 0; i < density; i++) {
      const seed = i * 1.618033988749;
      const x = (seed * 137.5) % w;
      const y = (seed * 97.3) % h;
      const size = 1 + (i % 3);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // No pattern
  none: () => {}
};

// Helper function for hexagon drawing
function drawHexagon(ctx, x, y, size) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
}

// ============================================================================
// MATERIAL PRESETS
// Controls Three.js material properties for the card
// ============================================================================

export const materialPresets = {
  // Default balanced look
  default: {
    cardMetalness: 0.3,
    cardRoughness: 0.4,
    sideMetalness: 0.8,
    sideRoughness: 0.2,
  },

  // High shine, reflective
  glossy: {
    cardMetalness: 0.6,
    cardRoughness: 0.1,
    sideMetalness: 0.9,
    sideRoughness: 0.1,
  },

  // No shine, soft look
  matte: {
    cardMetalness: 0.0,
    cardRoughness: 0.9,
    sideMetalness: 0.1,
    sideRoughness: 0.8,
  },

  // Chrome/metal look
  metallic: {
    cardMetalness: 0.9,
    cardRoughness: 0.2,
    sideMetalness: 1.0,
    sideRoughness: 0.1,
  },

  // Plastic card feel
  plastic: {
    cardMetalness: 0.0,
    cardRoughness: 0.3,
    sideMetalness: 0.0,
    sideRoughness: 0.3,
  },

  // Brushed metal look
  brushed: {
    cardMetalness: 0.7,
    cardRoughness: 0.5,
    sideMetalness: 0.8,
    sideRoughness: 0.4,
  },

  // Satin finish
  satin: {
    cardMetalness: 0.2,
    cardRoughness: 0.6,
    sideMetalness: 0.3,
    sideRoughness: 0.5,
  },

  // Glass-like
  glass: {
    cardMetalness: 0.1,
    cardRoughness: 0.05,
    sideMetalness: 0.2,
    sideRoughness: 0.05,
  },
};

// ============================================================================
// MATERIAL SETTINGS
// Main configuration object - edit these to customize your card
// ============================================================================

export const materialSettings = {
  // === FRONT CARD PATTERN ===
  // Options: 'grid', 'dots', 'hexagons', 'waves', 'diagonals', 'crosshatch', 
  //          'circuit', 'squares', 'triangles', 'noise', 'none'
  frontPattern: 'grid',
  
  // === BACK CARD PATTERN ===
  backPattern: 'waves',
  
  // === PATTERN SPACING ===
  // Controls density of patterns (higher = more spread out)
  // Recommended: 30-60 for most patterns
  frontPatternSpacing: 40,
  backPatternSpacing: 80,
  
  // === MATERIAL PRESET ===
  // Options: 'default', 'glossy', 'matte', 'metallic', 'plastic', 'brushed', 'satin', 'glass', 'custom'
  materialPreset: 'default',
  
  // === CUSTOM MATERIAL VALUES ===
  // Only used if materialPreset is 'custom'
  // Values range from 0.0 to 1.0
  custom: {
    cardMetalness: 0.3,   // 0 = non-metallic, 1 = fully metallic
    cardRoughness: 0.4,   // 0 = smooth/mirror, 1 = rough/diffuse
    sideMetalness: 0.8,
    sideRoughness: 0.2,
  },
  
  // === LIGHTING INTENSITY ===
  // Affects how dramatic the lighting looks
  ambientIntensity: 0.35,   // Base light level (0.2 - 0.8)
  point1Intensity: 1.5,     // Main accent light (0.5 - 2.5)
  point2Intensity: 1.0,     // Secondary light (0.3 - 2.0)
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the current material values based on preset or custom settings
 */
export function getMaterialValues(settings = materialSettings) {
  if (settings.materialPreset === 'custom') {
    return settings.custom;
  }
  return materialPresets[settings.materialPreset] || materialPresets.default;
}

/**
 * Draw pattern on canvas context
 * @param {string} patternType - Pattern name from patterns object
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} spacing - Pattern spacing
 * @param {string} color - Pattern color (CSS color string)
 */
export function drawPattern(patternType, ctx, width, height, spacing, color) {
  const patternFn = patterns[patternType];
  if (patternFn) {
    patternFn(ctx, width, height, spacing, color);
  }
}

/**
 * Get list of available pattern names
 */
export function getPatternNames() {
  return Object.keys(patterns);
}

/**
 * Get list of available preset names
 */
export function getPresetNames() {
  return Object.keys(materialPresets);
}