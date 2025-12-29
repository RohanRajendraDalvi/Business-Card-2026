import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as C from './constants';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { trackCardFlip, trackThemeToggle } from './analytics';

export default function BusinessCard() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  const sceneRef = useRef(null);
  const [isDark, setIsDark] = useState(true);
  const themeRef = useRef(isDark ? darkTheme : lightTheme);
  
  const [particles] = useState(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 10
    }))
  );

  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    if (!containerRef.current) return;
    themeRef.current = isDark ? darkTheme : lightTheme;
    
    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (containerRef.current.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const container = containerRef.current;
    const t = themeRef.current;
    let W = container.clientWidth, H = container.clientHeight;
    let qrImage = null;

    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.onload = () => { qrImage = qrImg; rebuildCard(); };
    qrImg.src = `${C.QR_CODE_URL}&bgcolor=${t.qrBgColor}&color=${t.qrFgColor}`;

    function drawQR(ctx, x, y, size) {
      ctx.fillStyle = t.qrBg;
      ctx.fillRect(x - 4, y - 4, size + 8, size + 8);
      if (qrImage) ctx.drawImage(qrImage, x, y, size, size);
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    
    const isPortrait = () => W < 768 || W < H;
    const getCameraZ = () => isPortrait() ? 4.5 : 3.0;
    camera.position.z = getCameraZ();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, t.ambientIntensity);
    scene.add(ambient);
    const point1 = new THREE.PointLight(t.lightColor1, t.point1Intensity, 10);
    point1.position.set(2, 2, 3);
    scene.add(point1);
    const point2 = new THREE.PointLight(t.lightColor2, t.point2Intensity, 10);
    point2.position.set(-2, -1, 2);
    scene.add(point2);

    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    function createFrontPortrait() {
      const canvas = document.createElement('canvas');
      canvas.width = 700; canvas.height = 1100;
      const ctx = canvas.getContext('2d');
      
      const grad = ctx.createLinearGradient(0, 0, 700, 1100);
      grad.addColorStop(0, t.bgPrimary);
      grad.addColorStop(0.5, t.bgSecondary);
      grad.addColorStop(1, t.bgPrimary);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 700, 1100);
      
      ctx.strokeStyle = t.gridColor;
      for (let i = 0; i < 700; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1100); ctx.stroke(); }
      for (let i = 0; i < 1100; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(700, i); ctx.stroke(); }
      
      ctx.fillStyle = t.textPrimary;
      ctx.font = 'bold 72px Segoe UI';
      ctx.fillText(C.NAME, 30, 75);
      
      ctx.font = 'bold 30px Segoe UI';
      ctx.fillStyle = t.accentCyan;
      ctx.fillText(C.TITLE, 30, 115);
      
      ctx.font = 'italic 24px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.TAGLINE, 30, 152);
      
      const divGrad = ctx.createLinearGradient(30, 0, 400, 0);
      divGrad.addColorStop(0, t.accentPrimary);
      divGrad.addColorStop(1, t.accentSecondary);
      ctx.fillStyle = divGrad;
      ctx.fillRect(30, 168, 340, 3);
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentCyan;
      ctx.fillText(C.SECTION_EDUCATION, 30, 205);
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.textSecondary;
      C.EDUCATION.forEach((e, i) => ctx.fillText(e, 30, 235 + i * 27));
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentCyan;
      ctx.fillText(C.SECTION_WHY_ME, 30, 310);
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.WHY_ME_POINTS.forEach((p, i) => ctx.fillText('› ' + p, 30, 342 + i * 30));
      
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.SECTION_LANGUAGES, 30, 480);
      ctx.font = 'bold 18px Segoe UI';
      C.LANGUAGES.forEach((l, i) => {
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
      ctx.fillText(C.SECTION_FRAMEWORKS, 30, 610);
      ctx.font = 'bold 18px Segoe UI';
      C.FRAMEWORKS.forEach((f, i) => {
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
      ctx.fillText(C.SECTION_AI, 30, 740);
      ctx.font = 'bold 18px Segoe UI';
      C.AI_SKILLS.forEach((a, i) => {
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
      ctx.fillText(C.CTA_TEXT, 350, 912);
      ctx.textAlign = 'left';
      
      ctx.strokeStyle = t.cornerFront;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(15, 15); ctx.lineTo(15, 60); ctx.moveTo(15, 15); ctx.lineTo(60, 15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(685, 15); ctx.lineTo(685, 60); ctx.moveTo(685, 15); ctx.lineTo(640, 15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(15, 1085); ctx.lineTo(15, 1040); ctx.moveTo(15, 1085); ctx.lineTo(60, 1085); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(685, 1085); ctx.lineTo(685, 1040); ctx.moveTo(685, 1085); ctx.lineTo(640, 1085); ctx.stroke();

      return new THREE.CanvasTexture(canvas);
    }

    function createBackPortrait() {
      const canvas = document.createElement('canvas');
      canvas.width = 700; canvas.height = 1100;
      const ctx = canvas.getContext('2d');
      
      const grad = ctx.createRadialGradient(350, 550, 0, 350, 550, 700);
      grad.addColorStop(0, t.bgRadialCenter);
      grad.addColorStop(1, t.bgRadialEdge);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 700, 1100);
      
      ctx.strokeStyle = t.circuitColor;
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 700, y = Math.random() * 1100;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.random() * 80 - 40, y); ctx.lineTo(x + Math.random() * 80 - 40, y + Math.random() * 80 - 40); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.stroke();
      }
      
      ctx.fillStyle = t.textPrimary;
      ctx.font = 'bold 64px Segoe UI';
      ctx.fillText(C.NAME, 30, 75);
      ctx.font = '28px Segoe UI';
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.ALT_TITLE, 30, 115);
      
      const divGrad = ctx.createLinearGradient(30, 0, 400, 0);
      divGrad.addColorStop(0, t.accentPrimary);
      divGrad.addColorStop(1, t.accentSecondary);
      ctx.fillStyle = divGrad;
      ctx.fillRect(30, 135, 380, 3);
      
      ctx.font = 'bold 26px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.SECTION_CONNECT, 30, 180);
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.EMAIL, 30, 215);
      ctx.fillText(C.PHONE, 30, 248);
      
      ctx.font = 'bold 26px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.SECTION_ONLINE, 30, 300);
      ctx.font = 'bold 21px Segoe UI';
      ctx.fillStyle = t.textMuted;
      ctx.fillText(C.LINKEDIN, 30, 333);
      ctx.fillText(C.GITHUB, 30, 363);
      ctx.fillText(C.PORTFOLIO_URL, 30, 393);
      
      ctx.font = 'bold 26px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.SECTION_WHAT_I_BRING, 30, 450);
      ctx.font = 'bold 21px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.WHAT_I_BRING.forEach((b, i) => ctx.fillText('› ' + b, 30, 485 + i * 34));
      
      ctx.font = 'bold 26px Segoe UI';
      ctx.fillStyle = t.accentTertiary;
      ctx.fillText(C.SECTION_SPECIALIZATIONS, 30, 635);
      ctx.font = 'bold 21px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.SPECIALIZATIONS.forEach((s, i) => ctx.fillText('› ' + s, 30, 670 + i * 34));
      
      ctx.font = 'bold 26px Segoe UI';
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.SECTION_CERTIFICATIONS, 30, 820);
      ctx.font = 'bold 21px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.CERTIFICATIONS.forEach((c, i) => ctx.fillText('› ' + c, 30, 855 + i * 34));
      
      ctx.strokeStyle = t.glassesColor;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(420, 160, 120, 60, 12);
      ctx.roundRect(560, 160, 120, 60, 12);
      ctx.moveTo(540, 190); ctx.lineTo(560, 190);
      ctx.stroke();
      ctx.fillStyle = t.glassesFill;
      ctx.fillRect(430, 170, 100, 40);
      ctx.fillRect(570, 170, 100, 40);
      
      drawQR(ctx, 520, 750, 150);
      ctx.font = 'bold 18px Segoe UI';
      ctx.fillStyle = t.textHint;
      ctx.textAlign = 'center';
      ctx.fillText(C.QR_LABEL, 595, 920);
      ctx.textAlign = 'left';
      
      ctx.strokeStyle = t.cornerBack;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(15, 15); ctx.lineTo(15, 60); ctx.moveTo(15, 15); ctx.lineTo(60, 15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(685, 15); ctx.lineTo(685, 60); ctx.moveTo(685, 15); ctx.lineTo(640, 15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(15, 1085); ctx.lineTo(15, 1040); ctx.moveTo(15, 1085); ctx.lineTo(60, 1085); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(685, 1085); ctx.lineTo(685, 1040); ctx.moveTo(685, 1085); ctx.lineTo(640, 1085); ctx.stroke();

      return new THREE.CanvasTexture(canvas);
    }

    function createFrontLandscape() {
      const canvas = document.createElement('canvas');
      canvas.width = 1400; canvas.height = 820;
      const ctx = canvas.getContext('2d');
      
      const grad = ctx.createLinearGradient(0, 0, 1400, 820);
      grad.addColorStop(0, t.bgPrimary);
      grad.addColorStop(0.5, t.bgSecondary);
      grad.addColorStop(1, t.bgPrimary);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1400, 820);
      
      ctx.strokeStyle = t.gridColor;
      for (let i = 0; i < 1400; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 820); ctx.stroke(); }
      for (let i = 0; i < 820; i += 50) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1400, i); ctx.stroke(); }
      
      ctx.fillStyle = t.textPrimary;
      ctx.font = 'bold 88px Segoe UI';
      ctx.fillText(C.NAME, 50, 140);
      
      ctx.font = 'bold 32px Segoe UI';
      ctx.fillStyle = t.accentCyan;
      ctx.fillText(C.TITLE, 50, 185);
      
      ctx.font = 'italic 26px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.TAGLINE, 50, 225);
      
      const divGrad = ctx.createLinearGradient(50, 0, 500, 0);
      divGrad.addColorStop(0, t.accentPrimary);
      divGrad.addColorStop(0.5, t.accentSecondary);
      divGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = divGrad;
      ctx.fillRect(50, 245, 450, 3);
      
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.accentCyan;
      ctx.fillText(C.SECTION_EDUCATION, 50, 290);
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.textSecondary;
      C.EDUCATION_FULL.forEach((e, i) => ctx.fillText(e, 50, 325 + i * 30));
      
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.accentCyan;
      ctx.fillText(C.SECTION_WHY_ME, 50, 405);
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.WHY_ME_POINTS.forEach((p, i) => ctx.fillText('› ' + p, 50, 440 + i * 32));
      
      ctx.fillStyle = t.ctaBg;
      ctx.beginPath();
      ctx.roundRect(50, 565, 320, 65, 32);
      ctx.fill();
      ctx.fillStyle = t.ctaText;
      ctx.font = 'bold 26px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText(C.CTA_TEXT, 210, 608);
      ctx.textAlign = 'left';
      
      const techX = 720;
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.SECTION_LANGUAGES, techX, 290);
      ctx.font = 'bold 18px Segoe UI';
      C.LANGUAGES_FULL.forEach((l, i) => {
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
      ctx.fillText(C.SECTION_FRAMEWORKS, techX, 430);
      ctx.font = 'bold 18px Segoe UI';
      C.FRAMEWORKS.forEach((f, i) => {
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
      ctx.fillText(C.SECTION_AI, techX, 570);
      ctx.font = 'bold 18px Segoe UI';
      C.AI_SKILLS.forEach((a, i) => {
        const x = techX + (i % 3) * 220, y = 600 + Math.floor(i / 3) * 42;
        ctx.fillStyle = t.aiBg;
        ctx.fillRect(x, y - 18, 205, 34);
        ctx.strokeStyle = t.aiBorder;
        ctx.strokeRect(x, y - 18, 205, 34);
        ctx.fillStyle = t.textSecondary;
        ctx.fillText(a, x + 14, y + 6);
      });
      
      ctx.strokeStyle = t.cornerFront;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(20, 20); ctx.lineTo(20, 80); ctx.moveTo(20, 20); ctx.lineTo(80, 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1380, 20); ctx.lineTo(1380, 80); ctx.moveTo(1380, 20); ctx.lineTo(1320, 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20, 800); ctx.lineTo(20, 740); ctx.moveTo(20, 800); ctx.lineTo(80, 800); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1380, 800); ctx.lineTo(1380, 740); ctx.moveTo(1380, 800); ctx.lineTo(1320, 800); ctx.stroke();

      return new THREE.CanvasTexture(canvas);
    }

    function createBackLandscape() {
      const canvas = document.createElement('canvas');
      canvas.width = 1400; canvas.height = 820;
      const ctx = canvas.getContext('2d');
      
      const grad = ctx.createRadialGradient(700, 410, 0, 700, 410, 800);
      grad.addColorStop(0, t.bgRadialCenter);
      grad.addColorStop(1, t.bgRadialEdge);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1400, 820);
      
      ctx.strokeStyle = t.circuitColor;
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 1400, y = Math.random() * 820;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.random() * 140 - 70, y); ctx.lineTo(x + Math.random() * 140 - 70, y + Math.random() * 140 - 70); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.stroke();
      }
      
      ctx.fillStyle = t.textPrimary;
      ctx.font = 'bold 72px Segoe UI';
      ctx.fillText(C.NAME, 50, 100);
      ctx.font = '28px Segoe UI';
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.ALT_TITLE, 50, 145);
      
      const divGrad = ctx.createLinearGradient(50, 0, 600, 0);
      divGrad.addColorStop(0, t.accentPrimary);
      divGrad.addColorStop(1, t.accentSecondary);
      ctx.fillStyle = divGrad;
      ctx.fillRect(50, 165, 550, 3);
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.SECTION_CONNECT, 50, 215);
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.EMAIL, 50, 258);
      ctx.fillText(C.PHONE, 50, 295);
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.SECTION_ONLINE, 50, 355);
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.textMuted;
      ctx.fillText(C.LINKEDIN, 50, 395);
      ctx.fillText(C.GITHUB, 50, 432);
      ctx.fillText(C.PORTFOLIO_URL, 50, 469);
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentSecondary;
      ctx.fillText(C.SECTION_WHAT_I_BRING, 50, 535);
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.WHAT_I_BRING.forEach((b, i) => ctx.fillText('› ' + b, 50, 575 + i * 38));
      
      ctx.strokeStyle = t.glassesColor;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(700, 180, 180, 90, 16);
      ctx.roundRect(910, 180, 180, 90, 16);
      ctx.moveTo(880, 225); ctx.lineTo(910, 225);
      ctx.moveTo(700, 225); ctx.lineTo(660, 208);
      ctx.moveTo(1090, 225); ctx.lineTo(1130, 208);
      ctx.stroke();
      ctx.fillStyle = t.glassesFill;
      ctx.fillRect(715, 195, 150, 60);
      ctx.fillRect(925, 195, 150, 60);
      
      ctx.font = 'italic 24px Segoe UI';
      ctx.fillStyle = t.textHint;
      ctx.fillText(C.ALT_TAGLINE, 650, 330);
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentTertiary;
      ctx.fillText(C.SECTION_SPECIALIZATIONS, 650, 400);
      ctx.font = 'bold 22px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.SPECIALIZATIONS.forEach((s, i) => ctx.fillText('› ' + s, 650, 442 + i * 38));
      
      ctx.font = 'bold 24px Segoe UI';
      ctx.fillStyle = t.accentPrimary;
      ctx.fillText(C.SECTION_CERTIFICATIONS, 650, 620);
      ctx.font = 'bold 20px Segoe UI';
      ctx.fillStyle = t.textMuted;
      C.CERTIFICATIONS.forEach((c, i) => ctx.fillText('› ' + c, 650, 658 + i * 34));
      
      drawQR(ctx, 1180, 550, 160);
      ctx.font = 'bold 16px Segoe UI';
      ctx.fillStyle = t.textHint;
      ctx.fillText(C.QR_LABEL, 1215, 735);
      
      ctx.strokeStyle = t.cornerBack;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(20, 20); ctx.lineTo(20, 80); ctx.moveTo(20, 20); ctx.lineTo(80, 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1380, 20); ctx.lineTo(1380, 80); ctx.moveTo(1380, 20); ctx.lineTo(1320, 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20, 800); ctx.lineTo(20, 740); ctx.moveTo(20, 800); ctx.lineTo(80, 800); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1380, 800); ctx.lineTo(1380, 740); ctx.moveTo(1380, 800); ctx.lineTo(1320, 800); ctx.stroke();

      return new THREE.CanvasTexture(canvas);
    }

    let card, edges;

    function rebuildCard() {
      if (card) { cardGroup.remove(card); cardGroup.remove(edges); }
      
      const portrait = isPortrait();
      const cw = portrait ? 2.0 : 3.6;
      const ch = portrait ? 3.2 : 2.2;
      
      const cardGeo = new THREE.BoxGeometry(cw, ch, 0.08);
      const sideMat = new THREE.MeshStandardMaterial({ color: t.cardSide, metalness: t.sideMetalness, roughness: t.sideRoughness });
      const materials = [
        sideMat, sideMat, sideMat, sideMat,
        new THREE.MeshStandardMaterial({ map: portrait ? createFrontPortrait() : createFrontLandscape(), metalness: t.cardMetalness, roughness: t.cardRoughness }),
        new THREE.MeshStandardMaterial({ map: portrait ? createBackPortrait() : createBackLandscape(), metalness: t.cardMetalness, roughness: t.cardRoughness })
      ];
      card = new THREE.Mesh(cardGeo, materials);
      cardGroup.add(card);
      
      const edgeGeo = new THREE.EdgesGeometry(cardGeo);
      const edgeMat = new THREE.LineBasicMaterial({ color: t.edgeColor, transparent: true, opacity: 0.6 });
      edges = new THREE.LineSegments(edgeGeo, edgeMat);
      cardGroup.add(edges);
    }

    rebuildCard();

    const orbGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const orbs = [];
    for (let i = 0; i < 8; i++) {
      const orbMat = new THREE.MeshBasicMaterial({ color: i % 2 ? t.orbColor1 : t.orbColor2, transparent: true, opacity: 0.7 });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2);
      orb.userData = { speed: 0.5 + Math.random(), offset: Math.random() * Math.PI * 2 };
      scene.add(orb);
      orbs.push(orb);
    }

    let isDragging = false, prevX = 0, prevY = 0;
    let targetRotX = 0.1, targetRotY = 0;

    const onMouseDown = (e) => { isDragging = true; prevX = e.clientX; prevY = e.clientY; };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      targetRotY += (e.clientX - prevX) * 0.01;
      targetRotX += (e.clientY - prevY) * 0.01;
      targetRotX = Math.max(-0.5, Math.min(0.5, targetRotX));
      prevX = e.clientX; prevY = e.clientY;
    };
    const onMouseUp = () => isDragging = false;
    const onClick = (e) => { 
    if (touchHandled) {
        touchHandled = false;
        return;
    }
    if (Math.abs(e.clientX - prevX) < 5) {
        targetRotY += Math.PI;
        trackCardFlip();
    }
    };
    const onWheel = (e) => { e.preventDefault(); camera.position.z = Math.max(2.0, Math.min(8, camera.position.z + e.deltaY * 0.005)); };

    let lastTouchDist = 0, lastTapTime = 0, touchHandled = false;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) { isDragging = true; prevX = e.touches[0].clientX; prevY = e.touches[0].clientY; }
      else if (e.touches.length === 2) lastTouchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      if (e.touches.length === 1 && isDragging) {
        targetRotY += (e.touches[0].clientX - prevX) * 0.01;
        targetRotX += (e.touches[0].clientY - prevY) * 0.01;
        targetRotX = Math.max(-0.5, Math.min(0.5, targetRotX));
        prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        camera.position.z = Math.max(2.0, Math.min(8, camera.position.z + (lastTouchDist - dist) * 0.02));
        lastTouchDist = dist;
      }
    };
    const onTouchEnd = (e) => {
    if (e.touches.length === 0) {
        const now = Date.now();
        if (isDragging && Math.abs(e.changedTouches[0].clientX - prevX) < 10 && Math.abs(e.changedTouches[0].clientY - prevY) < 10 && now - lastTapTime > 400) {
        targetRotY += Math.PI;
        trackCardFlip();
        touchHandled = true;
        lastTapTime = now;
        }
        isDragging = false;
    }
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseleave', onMouseUp);
    container.addEventListener('click', onClick);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);

    let time = 0, lastPortrait = isPortrait();
    
    function animate() {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.016;
      
      cardGroup.rotation.x += (targetRotX - cardGroup.rotation.x) * 0.08;
      cardGroup.rotation.y += (targetRotY - cardGroup.rotation.y) * 0.08;
      cardGroup.position.y = Math.sin(time) * 0.05;
      
      point1.position.x = Math.sin(time * 0.5) * 3;
      point1.position.y = Math.cos(time * 0.5) * 2;
      
      orbs.forEach(o => { 
        o.position.y += Math.sin(time * o.userData.speed + o.userData.offset) * 0.002; 
        o.position.x += Math.cos(time * o.userData.speed * 0.5 + o.userData.offset) * 0.001; 
      });
      
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      W = container.clientWidth; H = container.clientHeight;
      camera.aspect = W / H;
      camera.position.z = getCameraZ();
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      if (isPortrait() !== lastPortrait) { lastPortrait = isPortrait(); rebuildCard(); }
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mouseleave', onMouseUp);
      container.removeEventListener('click', onClick);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) container.removeChild(rendererRef.current.domElement);
      }
    };
  }, [isDark]);

  const bgGradient = isDark 
    ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', background: bgGradient }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {particles.map(p => (
          <div key={p.id} style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', background: p.id % 2 ? theme.particleColor : theme.particleAlt, left: `${p.left}%`, bottom: '-10px', opacity: 0.5, animation: `float ${p.duration}s infinite linear`, animationDelay: `${p.delay}s` }} />
        ))}
      </div>
      
      <button
        onClick={() => {
          const newTheme = !isDark ? 'dark' : 'light';
          setIsDark(!isDark);
          trackThemeToggle(newTheme);
        }}
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
      
      <div style={{ color: theme.textPrimary, textAlign: 'center', padding: '10px', zIndex: 10 }}>
        <h3 style={{ fontSize: '14px', color: theme.accentPrimary, letterSpacing: '3px', marginBottom: '5px', textTransform: 'uppercase' }}>{C.UI_TITLE}</h3>
        <p style={{ fontSize: '12px', color: theme.textHint }}>{C.UI_INSTRUCTIONS}</p>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '75vh', cursor: 'grab', touchAction: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10px', color: theme.textHint, fontSize: '12px', animation: 'pulse 2s infinite' }}>{C.UI_HINT}</div>
      <style>{`
        @keyframes float { 0% { transform: translateY(0); opacity: 0; } 5% { opacity: 0.5; } 95% { opacity: 0.5; } 100% { transform: translateY(-110vh); opacity: 0; } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}