import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import * as C from './constants';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { trackCardFlip, trackThemeToggle, trackContactDownload } from './analytics';
import { drawPattern, getMaterialValues, materialSettings, drawLogo, logoSettings } from './materials';

// ============ VCARD FUNCTIONS ============
function cleanContactData(str) {
  if (!str) return '';
  return str.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/gu, '').trim();
}

function generateVCard() {
  const name = C.NAME || 'Contact';
  const nameParts = name.split(' ');
  const lastName = nameParts.length > 1 ? nameParts.pop() : '';
  const firstName = nameParts.join(' ');
  
  let vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `N:${lastName};${firstName};;;`,
    `TITLE:${C.TITLE || ''}`,
    `ORG:${C.ALT_TITLE || ''}`,
  ];
  
  if (C.EMAIL) vcard.push(`EMAIL;TYPE=WORK:${cleanContactData(C.EMAIL)}`);
  if (C.PHONE) vcard.push(`TEL;TYPE=CELL:${cleanContactData(C.PHONE)}`);
  if (C.LINK_URL) vcard.push(`URL;TYPE=WORK:https://${cleanContactData(C.LINK_URL)}`);
  if (C.ONLINE_LINKS?.[0]) vcard.push(`X-SOCIALPROFILE;TYPE=linkedin:https://${cleanContactData(C.ONLINE_LINKS[0])}`);
  if (C.ONLINE_LINKS?.[1]) vcard.push(`X-SOCIALPROFILE;TYPE=github:https://${cleanContactData(C.ONLINE_LINKS[1])}`);
  if (C.TAGLINE) vcard.push(`NOTE:${C.TAGLINE.replace(/"/g, '')}`);
  
  vcard.push('END:VCARD');
  return vcard.join('\r\n');
}

function downloadVCard() {
  const vcard = generateVCard();
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(C.NAME || 'contact').replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============ TEXTURE FACTORY ============
function createTextureFactory(theme, images) {
  const t = theme;
  
  const calcFontSize = (ctx, text, maxWidth, maxSize, minSize = 24) => {
    let size = maxSize;
    ctx.font = `bold ${size}px Segoe UI`;
    while (ctx.measureText(text).width > maxWidth && size > minSize) {
      size -= 4;
      ctx.font = `bold ${size}px Segoe UI`;
    }
    return size;
  };

  const drawQR = (ctx, img, x, y, size) => {
    ctx.fillStyle = t.qrBg;
    ctx.fillRect(x - 4, y - 4, size + 8, size + 8);
    if (img) ctx.drawImage(img, x, y, size, size);
  };

  const drawCorners = (ctx, color, w, h, inset = 15, len = 45, lw = 3) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(inset, inset); ctx.lineTo(inset, inset + len); ctx.moveTo(inset, inset); ctx.lineTo(inset + len, inset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w - inset, inset); ctx.lineTo(w - inset, inset + len); ctx.moveTo(w - inset, inset); ctx.lineTo(w - inset - len, inset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(inset, h - inset); ctx.lineTo(inset, h - inset - len); ctx.moveTo(inset, h - inset); ctx.lineTo(inset + len, h - inset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w - inset, h - inset); ctx.lineTo(w - inset, h - inset - len); ctx.moveTo(w - inset, h - inset); ctx.lineTo(w - inset - len, h - inset); ctx.stroke();
  };

  return {
    createFrontPortrait: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 700; canvas.height = 1100;
      const ctx = canvas.getContext('2d');
      
      const grad = ctx.createLinearGradient(0, 0, 700, 1100);
      grad.addColorStop(0, t.bgPrimary);
      grad.addColorStop(0.5, t.bgSecondary);
      grad.addColorStop(1, t.bgPrimary);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 700, 1100);
      
      drawPattern(materialSettings.frontPattern, ctx, 700, 1100, materialSettings.frontPatternSpacing, t.gridColor);
      
      ctx.fillStyle = t.textPrimary;
      const nameSizeFP = calcFontSize(ctx, C.NAME, 520, 72, 36);
      ctx.font = `bold ${nameSizeFP}px Segoe UI`;
      ctx.fillText(C.NAME, 30, 75);
      
      const titleSizeFP = calcFontSize(ctx, C.TITLE, 520, 30, 18);
      ctx.font = `bold ${titleSizeFP}px Segoe UI`;
      ctx.fillStyle = t.accentCyan;
      ctx.fillText(C.TITLE, 30, 115);
      
      const taglineSizeFP = calcFontSize(ctx, C.TAGLINE, 520, 24, 14);
      ctx.font = `italic ${taglineSizeFP}px Segoe UI`;
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.TAGLINE, 30, 152);
      
      drawQR(ctx, images.cardQr, 570, 30, 100);
      ctx.font = 'bold 12px Segoe UI';
      ctx.fillStyle = t.textHint;
      ctx.textAlign = 'center';
      ctx.fillText(C.BUSINESS_CARD_QR_LABEL, 620, 148);
      ctx.textAlign = 'left';
      
      const divGrad = ctx.createLinearGradient(30, 0, 400, 0);
      divGrad.addColorStop(0, t.accentPrimary);
      divGrad.addColorStop(1, t.accentSecondary);
      ctx.fillStyle = divGrad;
      ctx.fillRect(30, 168, 340, 3);
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentCyan;
      ctx.fillText(C.FRONT_SECTION_1_TITLE, 30, 205);
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.textSecondary;
      C.FRONT_SECTION_1_ITEMS.forEach((e, i) => ctx.fillText(e, 30, 235 + i * 27));
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentCyan;
      ctx.fillText(C.FRONT_SECTION_2_TITLE, 30, 310);
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.FRONT_SECTION_2_ITEMS.forEach((p, i) => ctx.fillText('› ' + p, 30, 342 + i * 30));
      
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.SKILL_SET_1_TITLE, 30, 480);
      ctx.font = 'bold 18px Segoe UI';
      C.SKILL_SET_1.forEach((l, i) => {
        const x = 30 + (i % 3) * 215, y = 512 + Math.floor(i / 3) * 38;
        ctx.fillStyle = t.langBg;
        ctx.fillRect(x, y - 17, 205, 32);
        ctx.strokeStyle = t.langBorder;
        ctx.strokeRect(x, y - 17, 205, 32);
        ctx.fillStyle = t.textPrimary;
        ctx.fillText(l, x + 12, y + 6);
      });
      
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.SKILL_SET_2_TITLE, 30, 610);
      ctx.font = 'bold 18px Segoe UI';
      C.SKILL_SET_2.forEach((f, i) => {
        const x = 30 + (i % 3) * 215, y = 642 + Math.floor(i / 3) * 38;
        ctx.fillStyle = t.frameworkBg;
        ctx.fillRect(x, y - 17, 205, 32);
        ctx.strokeStyle = t.frameworkBorder;
        ctx.strokeRect(x, y - 17, 205, 32);
        ctx.fillStyle = t.textPrimary;
        ctx.fillText(f, x + 12, y + 6);
      });
      
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.accentTertiary;
      ctx.fillText(C.SKILL_SET_3_TITLE, 30, 740);
      ctx.font = 'bold 18px Segoe UI';
      C.SKILL_SET_3.forEach((a, i) => {
        const x = 30 + (i % 3) * 215, y = 772 + Math.floor(i / 3) * 38;
        ctx.fillStyle = t.aiBg;
        ctx.fillRect(x, y - 17, 205, 32);
        ctx.strokeStyle = t.aiBorder;
        ctx.strokeRect(x, y - 17, 205, 32);
        ctx.fillStyle = t.textPrimary;
        ctx.fillText(a, x + 12, y + 6);
      });
      
      ctx.fillStyle = t.ctaBg;
      ctx.beginPath();
      ctx.roundRect(140, 870, 420, 65, 32);
      ctx.fill();
      ctx.fillStyle = t.ctaText;
      ctx.font = 'bold 28px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText(C.LOCATION, 350, 912);
      ctx.textAlign = 'left';
      
      drawCorners(ctx, t.cornerFront, 700, 1100);

      return new THREE.CanvasTexture(canvas);
    },

    createBackPortrait: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 700; canvas.height = 1100;
      const ctx = canvas.getContext('2d');
      
      const grad = ctx.createRadialGradient(350, 550, 0, 350, 550, 700);
      grad.addColorStop(0, t.bgRadialCenter);
      grad.addColorStop(1, t.bgRadialEdge);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 700, 1100);
      
      drawPattern(materialSettings.backPattern, ctx, 700, 1100, materialSettings.backPatternSpacing, t.circuitColor);
      
      ctx.fillStyle = t.textPrimary;
      const nameSizeBP = calcFontSize(ctx, C.NAME, 640, 64, 32);
      ctx.font = `bold ${nameSizeBP}px Segoe UI`;
      ctx.fillText(C.NAME, 30, 75);
      const altTitleSizeBP = calcFontSize(ctx, C.ALT_TITLE, 640, 28, 16);
      ctx.font = `${altTitleSizeBP}px Segoe UI`;
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.ALT_TITLE, 30, 115);
      
      const divGrad = ctx.createLinearGradient(30, 0, 400, 0);
      divGrad.addColorStop(0, t.accentPrimary);
      divGrad.addColorStop(1, t.accentSecondary);
      ctx.fillStyle = divGrad;
      ctx.fillRect(30, 135, 380, 3);
      
      ctx.font = 'bold 26px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.BACK_SECTION_1_TITLE, 30, 180);
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.EMAIL, 30, 215);
      ctx.fillText(C.PHONE, 30, 248);
      
      ctx.font = 'bold 26px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.BACK_SECTION_2_TITLE, 30, 300);
      ctx.font = 'bold 21px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.ONLINE_LINKS.forEach((link, i) => ctx.fillText(link, 30, 333 + i * 30));
      
      ctx.font = 'bold 26px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.BACK_SECTION_3_TITLE, 30, 450);
      ctx.font = 'bold 21px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.BACK_SECTION_3_ITEMS.forEach((b, i) => ctx.fillText('› ' + b, 30, 485 + i * 34));
      
      ctx.font = 'bold 26px Segoe UI';
      ctx.fillStyle = t.accentTertiary;
      ctx.fillText(C.BACK_SECTION_4_TITLE, 30, 635);
      ctx.font = 'bold 21px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.BACK_SECTION_4_ITEMS.forEach((s, i) => ctx.fillText('› ' + s, 30, 670 + i * 34));
      
      ctx.font = 'bold 26px Segoe UI';
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.BACK_SECTION_5_TITLE, 30, 820);
      ctx.font = 'bold 21px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.BACK_SECTION_5_ITEMS.forEach((c, i) => ctx.fillText('› ' + c, 30, 855 + i * 34));
      
      drawLogo(ctx, 'portrait', t.glassesColor, t.glassesFill, images.logo);
      
      drawQR(ctx, images.linkQr, 520, 750, 150);
      ctx.font = 'bold 18px Segoe UI';
      ctx.fillStyle = t.textHint;
      ctx.textAlign = 'center';
      ctx.fillText(C.LINK_QR_LABEL, 595, 920);
      ctx.textAlign = 'left';
      
      drawCorners(ctx, t.cornerBack, 700, 1100);

      return new THREE.CanvasTexture(canvas);
    },

    createFrontLandscape: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1400; canvas.height = 820;
      const ctx = canvas.getContext('2d');
      
      const grad = ctx.createLinearGradient(0, 0, 1400, 820);
      grad.addColorStop(0, t.bgPrimary);
      grad.addColorStop(0.5, t.bgSecondary);
      grad.addColorStop(1, t.bgPrimary);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1400, 820);
      
      drawPattern(materialSettings.frontPattern, ctx, 1400, 820, materialSettings.frontPatternSpacing, t.gridColor);
      
      ctx.fillStyle = t.textPrimary;
      const nameSizeFL = calcFontSize(ctx, C.NAME, 1180, 88, 44);
      ctx.font = `bold ${nameSizeFL}px Segoe UI`;
      ctx.fillText(C.NAME, 50, 140);
      
      const titleSizeFL = calcFontSize(ctx, C.TITLE, 1180, 32, 20);
      ctx.font = `bold ${titleSizeFL}px Segoe UI`;
      ctx.fillStyle = t.accentCyan;
      ctx.fillText(C.TITLE, 50, 185);
      
      const taglineSizeFL = calcFontSize(ctx, C.TAGLINE, 1180, 26, 16);
      ctx.font = `italic ${taglineSizeFL}px Segoe UI`;
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.TAGLINE, 50, 225);
      
      drawQR(ctx, images.cardQr, 1260, 30, 110);
      ctx.font = 'bold 14px Segoe UI';
      ctx.fillStyle = t.textHint;
      ctx.textAlign = 'center';
      ctx.fillText(C.BUSINESS_CARD_QR_LABEL, 1315, 158);
      ctx.textAlign = 'left';
      
      const divGrad = ctx.createLinearGradient(50, 0, 500, 0);
      divGrad.addColorStop(0, t.accentPrimary);
      divGrad.addColorStop(0.5, t.accentSecondary);
      divGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = divGrad;
      ctx.fillRect(50, 245, 450, 3);
      
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.accentCyan;
      ctx.fillText(C.FRONT_SECTION_1_TITLE, 50, 290);
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.textSecondary;
      C.FRONT_SECTION_1_ITEMS.forEach((e, i) => ctx.fillText(e, 50, 325 + i * 30));
      
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.accentCyan;
      ctx.fillText(C.FRONT_SECTION_2_TITLE, 50, 405);
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.FRONT_SECTION_2_ITEMS.forEach((p, i) => ctx.fillText('› ' + p, 50, 440 + i * 32));
      
      ctx.fillStyle = t.ctaBg;
      ctx.beginPath();
      ctx.roundRect(50, 565, 320, 65, 32);
      ctx.fill();
      ctx.fillStyle = t.ctaText;
      ctx.font = 'bold 26px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText(C.LOCATION, 210, 608);
      ctx.textAlign = 'left';
      
      const techX = 720;
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.SKILL_SET_1_TITLE, techX, 290);
      ctx.font = 'bold 18px Segoe UI';
      C.SKILL_SET_1.forEach((l, i) => {
        const x = techX + (i % 3) * 220, y = 320 + Math.floor(i / 3) * 42;
        ctx.fillStyle = t.langBg;
        ctx.fillRect(x, y - 18, 205, 34);
        ctx.strokeStyle = t.langBorder;
        ctx.strokeRect(x, y - 18, 205, 34);
        ctx.fillStyle = t.textSecondary;
        ctx.fillText(l, x + 14, y + 6);
      });
      
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.SKILL_SET_2_TITLE, techX, 430);
      ctx.font = 'bold 18px Segoe UI';
      C.SKILL_SET_2.forEach((f, i) => {
        const x = techX + (i % 3) * 220, y = 460 + Math.floor(i / 3) * 42;
        ctx.fillStyle = t.frameworkBg;
        ctx.fillRect(x, y - 18, 205, 34);
        ctx.strokeStyle = t.frameworkBorder;
        ctx.strokeRect(x, y - 18, 205, 34);
        ctx.fillStyle = t.textSecondary;
        ctx.fillText(f, x + 14, y + 6);
      });
      
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.accentTertiary;
      ctx.fillText(C.SKILL_SET_3_TITLE, techX, 570);
      ctx.font = 'bold 18px Segoe UI';
      C.SKILL_SET_3.forEach((a, i) => {
        const x = techX + (i % 3) * 220, y = 600 + Math.floor(i / 3) * 42;
        ctx.fillStyle = t.aiBg;
        ctx.fillRect(x, y - 18, 205, 34);
        ctx.strokeStyle = t.aiBorder;
        ctx.strokeRect(x, y - 18, 205, 34);
        ctx.fillStyle = t.textSecondary;
        ctx.fillText(a, x + 14, y + 6);
      });
      
      drawCorners(ctx, t.cornerFront, 1400, 820, 20, 60, 4);

      return new THREE.CanvasTexture(canvas);
    },

    createBackLandscape: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1400; canvas.height = 820;
      const ctx = canvas.getContext('2d');
      
      const grad = ctx.createRadialGradient(700, 410, 0, 700, 410, 800);
      grad.addColorStop(0, t.bgRadialCenter);
      grad.addColorStop(1, t.bgRadialEdge);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1400, 820);
      
      drawPattern(materialSettings.backPattern, ctx, 1400, 820, materialSettings.backPatternSpacing, t.circuitColor);
      
      ctx.fillStyle = t.textPrimary;
      const nameSizeBL = calcFontSize(ctx, C.NAME, 580, 72, 36);
      ctx.font = `bold ${nameSizeBL}px Segoe UI`;
      ctx.fillText(C.NAME, 50, 100);
      const altTitleSizeBL = calcFontSize(ctx, C.ALT_TITLE, 580, 28, 16);
      ctx.font = `${altTitleSizeBL}px Segoe UI`;
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.ALT_TITLE, 50, 145);
      
      const divGrad = ctx.createLinearGradient(50, 0, 600, 0);
      divGrad.addColorStop(0, t.accentPrimary);
      divGrad.addColorStop(1, t.accentSecondary);
      ctx.fillStyle = divGrad;
      ctx.fillRect(50, 165, 550, 3);
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.BACK_SECTION_1_TITLE, 50, 215);
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.EMAIL, 50, 258);
      ctx.fillText(C.PHONE, 50, 295);
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.BACK_SECTION_2_TITLE, 50, 355);
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.ONLINE_LINKS.forEach((link, i) => ctx.fillText(link, 50, 395 + i * 37));
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.BACK_SECTION_3_TITLE, 50, 535);
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.BACK_SECTION_3_ITEMS.forEach((b, i) => ctx.fillText('› ' + b, 50, 575 + i * 38));
      
      drawLogo(ctx, 'landscape', t.glassesColor, t.glassesFill, images.logo);
      
      const altTaglineSizeBL = calcFontSize(ctx, C.ALT_TAGLINE, 500, 24, 14);
      ctx.font = `italic ${altTaglineSizeBL}px Segoe UI`;
      ctx.fillStyle = t.textHint;
      ctx.fillText(C.ALT_TAGLINE, 650, 330);
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentTertiary;
      ctx.fillText(C.BACK_SECTION_4_TITLE, 650, 400);
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.BACK_SECTION_4_ITEMS.forEach((s, i) => ctx.fillText('› ' + s, 650, 442 + i * 38));
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.BACK_SECTION_5_TITLE, 650, 620);
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.BACK_SECTION_5_ITEMS.forEach((c, i) => ctx.fillText('› ' + c, 650, 658 + i * 34));
      
      drawQR(ctx, images.linkQr, 1180, 550, 160);
      ctx.font = 'bold 16px Segoe UI';
      ctx.fillStyle = t.textHint;
      ctx.textAlign = 'center';
      ctx.fillText(C.LINK_QR_LABEL, 1260, 735);
      ctx.textAlign = 'left';
      
      drawCorners(ctx, t.cornerBack, 1400, 820, 20, 60, 4);

      return new THREE.CanvasTexture(canvas);
    }
  };
}

// ============ MAIN COMPONENT ============
export default function BusinessCard() {
  const containerRef = useRef(null);
  const [isDark, setIsDark] = useState(true);
  const [showSaved, setShowSaved] = useState(false);
  
  // Refs for Three.js objects - persist across renders
  const threeRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    cardGroup: null,
    card: null,
    edges: null,
    lights: { ambient: null, point1: null, point2: null },
    orbs: [],
    textures: { front: null, back: null },
    animationId: null,
    isInitialized: false,
  });
  
  // Animation state refs - avoid recreating functions
  const stateRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    targetRotX: 0.1,
    targetRotY: 0,
    time: 0,
    lastTouchDist: 0,
    lastTapTime: 0,
    isPortrait: true,
  });
  
  // Images ref
  const imagesRef = useRef({ linkQr: null, cardQr: null, logo: null });
  const imagesLoadedRef = useRef(false);
  
  // Rebuild trigger ref
  const needsRebuildRef = useRef(false);
  
  const theme = isDark ? darkTheme : lightTheme;
  
  // Memoized particles - created once
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 10
    })), []
  );

  // Load images once on mount
  useEffect(() => {
    if (imagesLoadedRef.current) return;
    imagesLoadedRef.current = true;
    
    const loadImage = (url) => new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
    
    // Load QR codes with neutral colors (will work for both themes)
    Promise.all([
      loadImage(`${C.LINK_QR_URL}&bgcolor=ffffff&color=000000`),
      loadImage(`${C.BUSINESS_CARD_QR_URL}&bgcolor=ffffff&color=000000`),
      logoSettings.source === 'custom' && logoSettings.customLogoPath 
        ? loadImage(logoSettings.customLogoPath) 
        : Promise.resolve(null)
    ]).then(([linkQr, cardQr, logo]) => {
      imagesRef.current = { linkQr, cardQr, logo };
      needsRebuildRef.current = true;
    });
  }, []);

  // Initialize Three.js scene ONCE
  useEffect(() => {
    if (!containerRef.current || threeRef.current.isInitialized) return;
    
    const container = containerRef.current;
    const three = threeRef.current;
    const state = stateRef.current;
    
    let W = container.clientWidth;
    let H = container.clientHeight;
    
    const isPortrait = () => W < 768 || W < H;
    state.isPortrait = isPortrait();
    
    // Scene
    three.scene = new THREE.Scene();
    three.cardGroup = new THREE.Group();
    three.scene.add(three.cardGroup);
    
    // Camera
    three.camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    three.camera.position.z = isPortrait() ? 4.5 : 3.0;
    
    // Renderer
    three.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    three.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    three.renderer.setSize(W, H);
    container.appendChild(three.renderer.domElement);
    
    // Lights (colors will be set in theme effect)
    three.lights.ambient = new THREE.AmbientLight(0xffffff, materialSettings.ambientIntensity);
    three.scene.add(three.lights.ambient);
    
    three.lights.point1 = new THREE.PointLight(0xffffff, materialSettings.point1Intensity, 10);
    three.lights.point1.position.set(2, 2, 3);
    three.scene.add(three.lights.point1);
    
    three.lights.point2 = new THREE.PointLight(0xffffff, materialSettings.point2Intensity, 10);
    three.lights.point2.position.set(-2, -1, 2);
    three.scene.add(three.lights.point2);
    
    // Orbs
    const orbGeo = new THREE.SphereGeometry(0.05, 8, 8);
    for (let i = 0; i < 6; i++) {
      const orbMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.7 });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2
      );
      orb.userData = { speed: 0.5 + Math.random(), offset: Math.random() * Math.PI * 2 };
      three.scene.add(orb);
      three.orbs.push(orb);
    }
    
    // Event handlers - defined once, use refs for state
    const onMouseDown = (e) => {
      state.isDragging = true;
      state.prevX = e.clientX;
      state.prevY = e.clientY;
    };
    
    const onMouseMove = (e) => {
      if (!state.isDragging) return;
      state.targetRotY += (e.clientX - state.prevX) * 0.01;
      state.targetRotX += (e.clientY - state.prevY) * 0.01;
      state.targetRotX = Math.max(-0.5, Math.min(0.5, state.targetRotX));
      state.prevX = e.clientX;
      state.prevY = e.clientY;
    };
    
    const onMouseUp = () => { state.isDragging = false; };
    
    let touchHandled = false;
    const onClick = (e) => {
      if (touchHandled) { touchHandled = false; return; }
      if (Math.abs(e.clientX - state.prevX) < 5) {
        state.targetRotY += Math.PI;
        trackCardFlip();
      }
    };
    
    const onWheel = (e) => {
      e.preventDefault();
      three.camera.position.z = Math.max(2.0, Math.min(8, three.camera.position.z + e.deltaY * 0.005));
    };
    
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        state.isDragging = true;
        state.prevX = e.touches[0].clientX;
        state.prevY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        state.lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };
    
    const onTouchMove = (e) => {
      e.preventDefault();
      if (e.touches.length === 1 && state.isDragging) {
        state.targetRotY += (e.touches[0].clientX - state.prevX) * 0.01;
        state.targetRotX += (e.touches[0].clientY - state.prevY) * 0.01;
        state.targetRotX = Math.max(-0.5, Math.min(0.5, state.targetRotX));
        state.prevX = e.touches[0].clientX;
        state.prevY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        three.camera.position.z = Math.max(2.0, Math.min(8, three.camera.position.z + (state.lastTouchDist - dist) * 0.02));
        state.lastTouchDist = dist;
      }
    };
    
    const onTouchEnd = (e) => {
      if (e.touches.length === 0) {
        const now = Date.now();
        const touch = e.changedTouches[0];
        if (state.isDragging && 
            Math.abs(touch.clientX - state.prevX) < 10 && 
            Math.abs(touch.clientY - state.prevY) < 10 && 
            now - state.lastTapTime > 400) {
          state.targetRotY += Math.PI;
          trackCardFlip();
          touchHandled = true;
          state.lastTapTime = now;
        }
        state.isDragging = false;
      }
    };
    
    // Debounced resize handler
    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        W = container.clientWidth;
        H = container.clientHeight;
        three.camera.aspect = W / H;
        three.camera.position.z = isPortrait() ? 4.5 : 3.0;
        three.camera.updateProjectionMatrix();
        three.renderer.setSize(W, H);
        
        if (isPortrait() !== state.isPortrait) {
          state.isPortrait = isPortrait();
          needsRebuildRef.current = true;
        }
      }, 100);
    };
    
    // Add event listeners
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseleave', onMouseUp);
    container.addEventListener('click', onClick);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('resize', onResize);
    
    // Animation loop
    const animate = () => {
      three.animationId = requestAnimationFrame(animate);
      state.time += 0.016;
      
      if (three.cardGroup) {
        three.cardGroup.rotation.x += (state.targetRotX - three.cardGroup.rotation.x) * 0.08;
        three.cardGroup.rotation.y += (state.targetRotY - three.cardGroup.rotation.y) * 0.08;
        three.cardGroup.position.y = Math.sin(state.time) * 0.05;
      }
      
      if (three.lights.point1) {
        three.lights.point1.position.x = Math.sin(state.time * 0.5) * 3;
        three.lights.point1.position.y = Math.cos(state.time * 0.5) * 2;
      }
      
      three.orbs.forEach(o => {
        o.position.y += Math.sin(state.time * o.userData.speed + o.userData.offset) * 0.002;
        o.position.x += Math.cos(state.time * o.userData.speed * 0.5 + o.userData.offset) * 0.001;
      });
      
      three.renderer.render(three.scene, three.camera);
    };
    animate();
    
    three.isInitialized = true;
    
    // Cleanup
    return () => {
      cancelAnimationFrame(three.animationId);
      clearTimeout(resizeTimeout);
      
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mouseleave', onMouseUp);
      container.removeEventListener('click', onClick);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      
      // Dispose Three.js resources
      if (three.renderer) {
        three.renderer.dispose();
        if (three.renderer.domElement && three.renderer.domElement.parentNode) {
          three.renderer.domElement.parentNode.removeChild(three.renderer.domElement);
        }
      }
      three.textures.front?.dispose();
      three.textures.back?.dispose();
      if (three.card) {
        three.card.geometry.dispose();
        three.card.material.forEach(m => m.dispose());
      }
      if (three.edges) {
        three.edges.geometry.dispose();
        three.edges.material.dispose();
      }
      three.orbs.forEach(o => {
        o.geometry.dispose();
        o.material.dispose();
      });
      
      three.isInitialized = false;
    };
  }, []); // Empty deps - runs once on mount

  // Update theme colors and rebuild card when theme changes
  useEffect(() => {
    const three = threeRef.current;
    const state = stateRef.current;
    
    if (!three.isInitialized) return;
    
    const t = isDark ? darkTheme : lightTheme;
    
    // Update light colors (no rebuild needed)
    three.lights.point1.color.setHex(t.lightColor1);
    three.lights.point2.color.setHex(t.lightColor2);
    
    // Update orb colors (no rebuild needed)
    three.orbs.forEach((orb, i) => {
      orb.material.color.setHex(i % 2 ? t.orbColor1 : t.orbColor2);
    });
    
    // Rebuild card with new theme
    const rebuildCard = () => {
      // Dispose old textures
      three.textures.front?.dispose();
      three.textures.back?.dispose();
      
      // Remove old card
      if (three.card) {
        three.cardGroup.remove(three.card);
        three.card.geometry.dispose();
        three.card.material.forEach(m => m.dispose());
      }
      if (three.edges) {
        three.cardGroup.remove(three.edges);
        three.edges.geometry.dispose();
        three.edges.material.dispose();
      }
      
      const portrait = state.isPortrait;
      const cw = portrait ? 2.0 : 3.6;
      const ch = portrait ? 3.2 : 2.2;
      
      const mat = getMaterialValues(materialSettings);
      const factory = createTextureFactory(t, imagesRef.current);
      
      const frontTex = portrait ? factory.createFrontPortrait() : factory.createFrontLandscape();
      const backTex = portrait ? factory.createBackPortrait() : factory.createBackLandscape();
      three.textures = { front: frontTex, back: backTex };
      
      const cardGeo = new THREE.BoxGeometry(cw, ch, 0.08);
      const sideMat = new THREE.MeshStandardMaterial({
        color: t.cardSide,
        metalness: mat.sideMetalness,
        roughness: mat.sideRoughness
      });
      
      const materials = [
        sideMat, sideMat, sideMat, sideMat,
        new THREE.MeshStandardMaterial({
          map: frontTex,
          metalness: mat.cardMetalness,
          roughness: mat.cardRoughness
        }),
        new THREE.MeshStandardMaterial({
          map: backTex,
          metalness: mat.cardMetalness,
          roughness: mat.cardRoughness
        })
      ];
      
      three.card = new THREE.Mesh(cardGeo, materials);
      three.cardGroup.add(three.card);
      
      const edgeGeo = new THREE.EdgesGeometry(cardGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: t.edgeColor,
        transparent: true,
        opacity: 0.6
      });
      three.edges = new THREE.LineSegments(edgeGeo, edgeMat);
      three.cardGroup.add(three.edges);
      
      needsRebuildRef.current = false;
    };
    
    // Debounce the rebuild slightly
    const timeoutId = setTimeout(rebuildCard, 50);
    
    return () => clearTimeout(timeoutId);
  }, [isDark]);

  // Check for rebuild needs (from resize or image load)
  useEffect(() => {
    const checkRebuild = setInterval(() => {
      if (needsRebuildRef.current && threeRef.current.isInitialized) {
        // Trigger rebuild by toggling a dummy state or dispatch event
        const t = isDark ? darkTheme : lightTheme;
        const three = threeRef.current;
        const state = stateRef.current;
        
        // Dispose and rebuild
        three.textures.front?.dispose();
        three.textures.back?.dispose();
        
        if (three.card) {
          three.cardGroup.remove(three.card);
          three.card.geometry.dispose();
          three.card.material.forEach(m => m.dispose());
        }
        if (three.edges) {
          three.cardGroup.remove(three.edges);
          three.edges.geometry.dispose();
          three.edges.material.dispose();
        }
        
        const portrait = state.isPortrait;
        const cw = portrait ? 2.0 : 3.6;
        const ch = portrait ? 3.2 : 2.2;
        
        const mat = getMaterialValues(materialSettings);
        const factory = createTextureFactory(t, imagesRef.current);
        
        const frontTex = portrait ? factory.createFrontPortrait() : factory.createFrontLandscape();
        const backTex = portrait ? factory.createBackPortrait() : factory.createBackLandscape();
        three.textures = { front: frontTex, back: backTex };
        
        const cardGeo = new THREE.BoxGeometry(cw, ch, 0.08);
        const sideMat = new THREE.MeshStandardMaterial({
          color: t.cardSide,
          metalness: mat.sideMetalness,
          roughness: mat.sideRoughness
        });
        
        const materials = [
          sideMat, sideMat, sideMat, sideMat,
          new THREE.MeshStandardMaterial({ map: frontTex, metalness: mat.cardMetalness, roughness: mat.cardRoughness }),
          new THREE.MeshStandardMaterial({ map: backTex, metalness: mat.cardMetalness, roughness: mat.cardRoughness })
        ];
        
        three.card = new THREE.Mesh(cardGeo, materials);
        three.cardGroup.add(three.card);
        
        const edgeGeo = new THREE.EdgesGeometry(cardGeo);
        const edgeMat = new THREE.LineBasicMaterial({ color: t.edgeColor, transparent: true, opacity: 0.6 });
        three.edges = new THREE.LineSegments(edgeGeo, edgeMat);
        three.cardGroup.add(three.edges);
        
        needsRebuildRef.current = false;
      }
    }, 100);
    
    return () => clearInterval(checkRebuild);
  }, [isDark]);

  // Memoized handlers
  const handleDownload = useCallback(() => {
    downloadVCard();
    trackContactDownload();
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  }, []);

  const handleThemeToggle = useCallback(() => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    trackThemeToggle(newTheme);
  }, [isDark]);

  const bgGradient = isDark 
    ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)';

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      overflow: 'hidden', 
      position: 'relative', 
      background: bgGradient 
    }}>
      {/* Particles Background */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        pointerEvents: 'none', 
        overflow: 'hidden', 
        zIndex: 0 
      }}>
        {particles.map(p => (
          <div 
            key={p.id} 
            style={{ 
              position: 'absolute', 
              width: '4px', 
              height: '4px', 
              borderRadius: '50%', 
              background: p.id % 2 ? theme.particleColor : theme.particleAlt, 
              left: `${p.left}%`, 
              bottom: '-10px', 
              opacity: 0.5, 
              animation: `float ${p.duration}s infinite linear`, 
              animationDelay: `${p.delay}s` 
            }} 
          />
        ))}
      </div>
      
      {/* Theme Toggle Button */}
      <button
        onClick={handleThemeToggle}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 100,
          padding: '12px 20px',
          borderRadius: '25px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          color: isDark ? '#00d4ff' : '#1e3a5f',
          backdropFilter: 'blur(10px)',
          boxShadow: isDark ? '0 4px 15px rgba(0,212,255,0.3)' : '0 4px 15px rgba(30,58,95,0.3)',
        }}
      >
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>
      
      {/* Download Contact Button */}
      <button
        onClick={handleDownload}
        style={{
          position: 'fixed',
          bottom: '5vh',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          padding: '12px 20px',
          borderRadius: '25px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          background: showSaved
            ? (isDark ? 'rgba(0,255,136,0.3)' : 'rgba(5,150,105,0.3)')
            : (isDark 
              ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(255,0,128,0.2))' 
              : 'linear-gradient(135deg, rgba(30,58,95,0.2), rgba(59,130,246,0.2))'),
          color: isDark ? '#00ff88' : '#059669',
          backdropFilter: 'blur(10px)',
          boxShadow: isDark ? '0 4px 15px rgba(0,255,136,0.3)' : '0 4px 15px rgba(5,150,105,0.3)',
        }}
      >
        {showSaved ? '✓ Downloaded!' : 'Add to Contacts'}
      </button>
      
      {/* Header */}
      <div style={{ color: theme.textPrimary, textAlign: 'center', padding: '10px', zIndex: 10 }}>
        <h3 style={{ 
          fontSize: '14px', 
          color: theme.accentPrimary, 
          letterSpacing: '3px', 
          marginBottom: '5px', 
          textTransform: 'uppercase' 
        }}>
          {C.UI_TITLE}
        </h3>
        <p style={{ fontSize: '12px', color: theme.textHint }}>{C.UI_INSTRUCTIONS}</p>
      </div>
      
      {/* Three.js Canvas Container */}
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '75vh', cursor: 'grab', touchAction: 'none' }} 
      />
      
      {/* Bottom Hint */}
      <div style={{ 
        position: 'fixed', 
        bottom: '10px', 
        color: theme.textHint, 
        fontSize: '12px', 
        animation: 'pulse 2s infinite' 
      }}>
        {C.UI_HINT}
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes float { 
          0% { transform: translateY(0); opacity: 0; } 
          5% { opacity: 0.5; } 
          95% { opacity: 0.5; } 
          100% { transform: translateY(-110vh); opacity: 0; } 
        }
        @keyframes pulse { 
          0%, 100% { opacity: 0.5; } 
          50% { opacity: 1; } 
        }
      `}</style>
    </div>
  );
}