// Drawing only: the world's state and the current screen in, pixels out.
// The 1280x720 playfield is scaled to fit the window and centred.
// One renderer draws both panels from the same scene data (render.js + scenes.js):
// the left panel from level.elements, the right from rightElements(level).
import { BUTTONS, FIELD, FONT, PALETTE, PANEL_LEFT, PANEL_RIGHT } from './config.js';
import { rightElements } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_CLEAR = 'clear';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** One scene element, drawn at panel-local coordinates inside a clipped panel. */
function drawElement(ctx, el, time) {
  const s = el.s ?? 1;
  switch (el.kind) {
    case 'moon': {
      circle(ctx, el.x, el.y, el.r, el.color);
      circle(ctx, el.x - el.r * 0.3, el.y - el.r * 0.2, el.r * 0.16, 'rgba(190, 170, 130, 0.55)');
      circle(ctx, el.x + el.r * 0.25, el.y + el.r * 0.3, el.r * 0.12, 'rgba(190, 170, 130, 0.55)');
      break;
    }
    case 'star': {
      circle(ctx, el.x, el.y, el.r, el.color);
      if (el.r >= 3) {
        ctx.strokeStyle = el.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(el.x - el.r * 2.2, el.y); ctx.lineTo(el.x + el.r * 2.2, el.y);
        ctx.moveTo(el.x, el.y - el.r * 2.2); ctx.lineTo(el.x, el.y + el.r * 2.2);
        ctx.stroke();
      }
      break;
    }
    case 'cloud': {
      ctx.fillStyle = el.color;
      ctx.beginPath();
      ctx.ellipse(el.x, el.y, el.w / 2, el.h, 0, 0, Math.PI * 2);
      ctx.ellipse(el.x - el.w * 0.25, el.y + 4, el.w / 4, el.h * 0.8, 0, 0, Math.PI * 2);
      ctx.ellipse(el.x + el.w * 0.25, el.y + 4, el.w / 4, el.h * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'tree': {
      ctx.fillStyle = '#4a3220';
      ctx.fillRect(el.x - 8 * s, el.y - 40 * s, 16 * s, 90 * s);
      circle(ctx, el.x, el.y - 70 * s, 46 * s, '#2a5a2a');
      circle(ctx, el.x - 34 * s, el.y - 45 * s, 30 * s, '#357a35');
      circle(ctx, el.x + 34 * s, el.y - 45 * s, 30 * s, '#2f6a2f');
      break;
    }
    case 'pine': {
      ctx.fillStyle = '#4a3220';
      ctx.fillRect(el.x - 4 * s, el.y - 6 * s, 8 * s, 22 * s);
      ctx.fillStyle = el.color;
      for (let i = 0; i < 3; i += 1) {
        const w = (44 - i * 10) * s;
        const y = el.y - i * 26 * s;
        ctx.beginPath();
        ctx.moveTo(el.x - w / 2, y); ctx.lineTo(el.x + w / 2, y); ctx.lineTo(el.x, y - 34 * s);
        ctx.closePath(); ctx.fill();
      }
      break;
    }
    case 'bush': {
      circle(ctx, el.x - el.r * 0.5, el.y, el.r * 0.7, el.color);
      circle(ctx, el.x + el.r * 0.5, el.y, el.r * 0.7, el.color);
      circle(ctx, el.x, el.y - el.r * 0.4, el.r * 0.8, el.color);
      break;
    }
    case 'pond': {
      ellipse(ctx, el.x, el.y, el.rx, el.ry, el.color);
      ellipse(ctx, el.x - 40, el.y - 12, el.rx * 0.5, el.ry * 0.35, 'rgba(140, 200, 230, 0.35)');
      ctx.strokeStyle = 'rgba(220, 240, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(el.x, el.y, el.rx, el.ry, 0, 0, Math.PI * 2); ctx.stroke();
      break;
    }
    case 'koi': {
      ctx.save();
      ctx.translate(el.x, el.y);
      ctx.scale(el.dir, 1);
      ellipse(ctx, 0, 0, 20 * s, 8 * s, el.color);
      ctx.beginPath(); ctx.moveTo(-18 * s, 0); ctx.lineTo(-30 * s, -8 * s); ctx.lineTo(-30 * s, 8 * s); ctx.closePath();
      ctx.fillStyle = el.color; ctx.fill();
      circle(ctx, 12 * s, -2 * s, 1.8, '#1a1a1a');
      ctx.restore();
      break;
    }
    case 'stoneLantern': {
      const x = el.x, y = el.y;
      ctx.fillStyle = '#8a8a96';
      ctx.fillRect(x - 26 * s, y + 22 * s, 52 * s, 10 * s); // base
      ctx.fillRect(x - 8 * s, y + 2 * s, 16 * s, 20 * s); // pillar
      ctx.fillRect(x - 22 * s, y - 14 * s, 44 * s, 16 * s); // light box
      ctx.fillRect(x - 28 * s, y - 22 * s, 56 * s, 8 * s); // roof
      ctx.beginPath(); ctx.moveTo(x - 20 * s, y - 22 * s); ctx.lineTo(x, y - 38 * s); ctx.lineTo(x + 20 * s, y - 22 * s); ctx.closePath(); ctx.fill();
      circle(ctx, x, y - 6 * s, 6 * s, el.flame); // flame window
      break;
    }
    case 'flower': {
      ctx.strokeStyle = '#2a5a2a'; ctx.lineWidth = 3 * s;
      ctx.beginPath(); ctx.moveTo(el.x, el.y); ctx.lineTo(el.x, el.y + 22 * s); ctx.stroke();
      for (let i = 0; i < 5; i += 1) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        circle(ctx, el.x + Math.cos(a) * 9 * s, el.y + Math.sin(a) * 9 * s, 7 * s, el.petal);
      }
      circle(ctx, el.x, el.y, 6 * s, el.center);
      break;
    }
    case 'butterfly': {
      const flap = Math.sin(time * 6) * 0.25;
      ctx.save(); ctx.translate(el.x, el.y); ctx.rotate(-0.3);
      ctx.fillStyle = el.color;
      ctx.save(); ctx.rotate(-flap); ellipse(ctx, -10 * s, -4 * s, 12 * s, 8 * s, el.color); ctx.restore();
      ctx.save(); ctx.rotate(flap); ellipse(ctx, 10 * s, -4 * s, 12 * s, 8 * s, el.color); ctx.restore();
      ellipse(ctx, -8 * s, 8 * s, 8 * s, 5 * s, el.color);
      ellipse(ctx, 8 * s, 8 * s, 8 * s, 5 * s, el.color);
      ctx.fillStyle = '#2a2a2a'; ctx.fillRect(-2 * s, -10 * s, 4 * s, 20 * s);
      ctx.restore();
      break;
    }
    case 'cat': {
      ctx.fillStyle = el.color;
      ellipse(ctx, el.x, el.y + 12 * s, 22 * s, 12 * s, el.color); // body
      circle(ctx, el.x + 16 * s, el.y - 4 * s, 11 * s, el.color); // head
      ctx.beginPath(); ctx.moveTo(el.x + 8 * s, el.y - 10 * s); ctx.lineTo(el.x + 11 * s, el.y - 20 * s); ctx.lineTo(el.x + 15 * s, el.y - 10 * s); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(el.x + 18 * s, el.y - 12 * s); ctx.lineTo(el.x + 22 * s, el.y - 21 * s); ctx.lineTo(el.x + 25 * s, el.y - 11 * s); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = el.color; ctx.lineWidth = 5 * s;
      ctx.beginPath(); ctx.moveTo(el.x - 20 * s, el.y + 14 * s); ctx.quadraticCurveTo(el.x - 34 * s, el.y + 2 * s, el.x - 28 * s, el.y - 12 * s); ctx.stroke();
      circle(ctx, el.x + 20 * s, el.y - 6 * s, 1.6, '#ffd23f'); // eye
      break;
    }
    case 'firefly': {
      const pulse = 0.6 + 0.4 * Math.sin(time * 3 + el.x);
      ctx.save();
      ctx.shadowColor = el.color; ctx.shadowBlur = 12;
      ctx.globalAlpha = pulse;
      circle(ctx, el.x, el.y, el.r, el.color);
      ctx.restore();
      break;
    }
    case 'fence': {
      ctx.fillStyle = '#5a4028';
      ctx.fillRect(el.x, el.y, el.w, 6);
      ctx.fillRect(el.x, el.y + 22, el.w, 6);
      for (let x = el.x + 10; x < el.x + el.w; x += 60) ctx.fillRect(x, el.y - 8, 10, 44);
      break;
    }
    case 'rock': case 'stone': {
      ellipse(ctx, el.x, el.y, 18 * s, 11 * s, el.color);
      ellipse(ctx, el.x - 4, el.y - 3, 9 * s, 5 * s, 'rgba(255,255,255,0.18)');
      break;
    }
    case 'wire': {
      ctx.strokeStyle = '#0e0e18'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(el.x, el.y); ctx.quadraticCurveTo(el.x + el.w / 2, el.y + 26, el.x + el.w, el.y); ctx.stroke();
      break;
    }
    case 'flag': {
      ctx.fillStyle = el.color;
      ctx.beginPath(); ctx.moveTo(el.x - 11, el.y + 4); ctx.lineTo(el.x + 11, el.y + 4); ctx.lineTo(el.x, el.y + 26); ctx.closePath(); ctx.fill();
      break;
    }
    case 'bulb': {
      ctx.save(); ctx.shadowColor = el.color; ctx.shadowBlur = 14;
      circle(ctx, el.x, el.y, el.r, el.color); ctx.restore();
      ctx.strokeStyle = '#0e0e18'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(el.x, el.y - el.r - 8); ctx.lineTo(el.x, el.y - el.r); ctx.stroke();
      break;
    }
    case 'paperLantern': {
      ctx.save(); ctx.shadowColor = el.color; ctx.shadowBlur = 16;
      circle(ctx, el.x, el.y, el.r, el.color); ctx.restore();
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1.5;
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath(); ctx.ellipse(el.x, el.y, el.r * 0.55, el.r * (0.9 - Math.abs(i) * 0.25), 0, -Math.PI / 2.4, Math.PI / 2.4); ctx.stroke();
      }
      ctx.fillStyle = '#f2c94c'; ctx.fillRect(el.x - 6, el.y + el.r - 2, 12, 8);
      ctx.fillStyle = '#f2c94c'; ctx.fillRect(el.x - 6, el.y - el.r - 6, 12, 6);
      break;
    }
    case 'hangLamp': {
      ctx.strokeStyle = '#0e0e18'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(el.x, el.y - 46 * s); ctx.lineTo(el.x, el.y - 14 * s); ctx.stroke();
      ctx.fillStyle = '#8a8a96';
      ctx.beginPath(); ctx.moveTo(el.x - 18 * s, el.y - 14 * s); ctx.lineTo(el.x + 18 * s, el.y - 14 * s); ctx.lineTo(el.x + 10 * s, el.y + 14 * s); ctx.lineTo(el.x - 10 * s, el.y + 14 * s); ctx.closePath(); ctx.fill();
      circle(ctx, el.x, el.y, 7 * s, el.flame);
      break;
    }
    case 'sign': {
      ctx.fillStyle = el.color;
      ctx.fillRect(el.x - el.w / 2, el.y - el.h / 2, el.w, el.h);
      ctx.strokeStyle = '#f2c94c'; ctx.lineWidth = 3; ctx.strokeRect(el.x - el.w / 2 + 3, el.y - el.h / 2 + 3, el.w - 6, el.h - 6);
      ctx.fillStyle = '#f5efe0'; ctx.font = `bold 20px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(el.text, el.x, el.y + 1);
      break;
    }
    case 'vendor': {
      ctx.fillStyle = el.shirt;
      ctx.beginPath(); ctx.moveTo(el.x - 20 * s, el.y + 44 * s); ctx.lineTo(el.x + 20 * s, el.y + 44 * s); ctx.lineTo(el.x + 14 * s, el.y + 6 * s); ctx.lineTo(el.x - 14 * s, el.y + 6 * s); ctx.closePath(); ctx.fill();
      circle(ctx, el.x, el.y - 6 * s, 13 * s, '#e8b88a'); // head
      ctx.fillStyle = el.hat;
      ctx.beginPath(); ctx.ellipse(el.x, el.y - 14 * s, 22 * s, 6 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(el.x, el.y - 14 * s, 12 * s, Math.PI, 0); ctx.fill();
      break;
    }
    case 'stall': {
      ctx.fillStyle = el.body;
      ctx.fillRect(el.x - el.w / 2, el.y - 30, el.w, el.h);
      ctx.fillStyle = el.awning;
      ctx.beginPath(); ctx.moveTo(el.x - el.w / 2 - 8, el.y - 30); ctx.lineTo(el.x + el.w / 2 + 8, el.y - 30); ctx.lineTo(el.x + el.w / 2, el.y - 58); ctx.lineTo(el.x - el.w / 2, el.y - 58); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      for (let i = -2; i <= 2; i += 2) ctx.fillRect(el.x + i * 22 - 11, el.y - 58, 22, 28);
      ctx.fillStyle = '#3a2a1e'; ctx.fillRect(el.x - el.w / 2, el.y + el.h - 14, el.w, 14);
      break;
    }
    case 'crate': {
      ctx.fillStyle = el.color; ctx.fillRect(el.x - 18 * s, el.y - 18 * s, 36 * s, 36 * s);
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 2;
      ctx.strokeRect(el.x - 18 * s, el.y - 18 * s, 36 * s, 36 * s);
      ctx.beginPath(); ctx.moveTo(el.x - 18 * s, el.y - 18 * s); ctx.lineTo(el.x + 18 * s, el.y + 18 * s); ctx.moveTo(el.x + 18 * s, el.y - 18 * s); ctx.lineTo(el.x - 18 * s, el.y + 18 * s); ctx.stroke();
      break;
    }
    case 'basket': {
      ctx.fillStyle = el.color;
      ctx.beginPath(); ctx.moveTo(el.x - 24 * s, el.y - 8 * s); ctx.lineTo(el.x + 24 * s, el.y - 8 * s); ctx.lineTo(el.x + 18 * s, el.y + 14 * s); ctx.lineTo(el.x - 18 * s, el.y + 14 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(el.x - 26 * s, el.y - 10 * s, 52 * s, 5 * s);
      break;
    }
    case 'orange': {
      circle(ctx, el.x, el.y, el.r, el.color);
      circle(ctx, el.x - 3, el.y - 3, el.r * 0.3, 'rgba(255,255,255,0.4)');
      ctx.fillStyle = '#3a7a3a';
      ctx.beginPath(); ctx.ellipse(el.x + 4, el.y - el.r - 2, 6, 3, -0.5, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'band': {
      ctx.save(); ctx.translate(el.x + el.w / 2, el.y + el.h / 2); ctx.rotate((el.angle * Math.PI) / 180);
      ctx.fillStyle = el.color; ctx.fillRect(-el.w / 2, -el.h / 2, el.w, el.h);
      ctx.restore();
      break;
    }
    case 'planet': {
      if (el.ring) {
        ctx.strokeStyle = '#d8c090'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.ellipse(el.x, el.y, el.r * 1.7, el.r * 0.45, -0.35, 0, Math.PI * 2); ctx.stroke();
      }
      circle(ctx, el.x, el.y, el.r, el.color);
      circle(ctx, el.x - el.r * 0.3, el.y - el.r * 0.25, el.r * 0.2, 'rgba(0,0,0,0.18)');
      break;
    }
    case 'meteor': {
      const a = (el.angle * Math.PI) / 180;
      const dx = Math.cos(a) * el.len, dy = Math.sin(a) * el.len;
      const grad = ctx.createLinearGradient(el.x, el.y, el.x - dx, el.y - dy);
      grad.addColorStop(0, el.color); grad.addColorStop(1, 'rgba(255,230,109,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(el.x, el.y); ctx.lineTo(el.x - dx, el.y - dy); ctx.stroke();
      circle(ctx, el.x, el.y, 4, '#ffffff');
      break;
    }
    case 'satellite': {
      ctx.fillStyle = el.color;
      ctx.fillRect(el.x - 14 * s, el.y - 6 * s, 10 * s, 12 * s);
      ctx.fillRect(el.x + 4 * s, el.y - 6 * s, 10 * s, 12 * s);
      ctx.fillStyle = '#8a8aa0'; ctx.fillRect(el.x - 4 * s, el.y - 5 * s, 8 * s, 10 * s);
      ctx.strokeStyle = el.color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(el.x, el.y - 5 * s); ctx.lineTo(el.x + 8 * s, el.y - 16 * s); ctx.stroke();
      break;
    }
    case 'constellation': {
      ctx.strokeStyle = el.color; ctx.lineWidth = 1.5;
      ctx.beginPath();
      el.points.forEach(([px, py], i) => { if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); });
      ctx.stroke();
      for (const [px, py] of el.points) circle(ctx, px, py, 3.5, '#ffffff');
      break;
    }
    case 'dome': {
      ctx.fillStyle = '#b8b8c8';
      ctx.fillRect(el.x - 46 * s, el.y - 6 * s, 92 * s, 46 * s);
      ctx.fillStyle = el.color;
      ctx.beginPath(); ctx.arc(el.x, el.y - 6 * s, 46 * s, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(el.x - 8 * s, el.y - 52 * s, 16 * s, 46 * s); // slit
      if (el.window) {
        ctx.fillStyle = '#ffe66d';
        ctx.fillRect(el.x - 34 * s, el.y + 10 * s, 16 * s, 20 * s);
      }
      break;
    }
    case 'telescope': {
      ctx.strokeStyle = '#6a6a7a'; ctx.lineWidth = 4 * s;
      ctx.beginPath();
      ctx.moveTo(el.x, el.y); ctx.lineTo(el.x - 22 * s, el.y + 44 * s);
      ctx.moveTo(el.x, el.y); ctx.lineTo(el.x + 22 * s, el.y + 44 * s);
      ctx.moveTo(el.x, el.y); ctx.lineTo(el.x, el.y + 44 * s);
      ctx.stroke();
      const a = (el.angle * Math.PI) / 180;
      const ex = el.x + Math.cos(a) * 62 * s, ey = el.y + Math.sin(a) * 62 * s;
      ctx.strokeStyle = el.color; ctx.lineWidth = 10 * s; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(el.x, el.y); ctx.lineTo(ex, ey); ctx.stroke();
      circle(ctx, ex, ey, 8 * s, '#3a3a4a');
      circle(ctx, el.x, el.y, 6 * s, '#8a8aa0');
      break;
    }
    default:
      break;
  }
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };
  const fonts = new Map();

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(window.innerWidth * ratio);
    const height = Math.round(window.innerHeight * ratio);
    canvas.width = width;
    canvas.height = height;
    view.scale = Math.min(width / FIELD.width, height / FIELD.height);
    view.x = (width - FIELD.width * view.scale) / 2;
    view.y = (height - FIELD.height * view.scale) / 2;
  }

  function text(value, x, y, size, color, align = 'left', weight = '') {
    const key = `${weight}${size}`;
    if (!fonts.has(key)) fonts.set(key, `${weight} ${size}px ${FONT}`.trim());
    ctx.font = fonts.get(key);
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(value, x, y);
  }

  function drawPanelBackground(level, panel) {
    const { bg } = level;
    const grad = ctx.createLinearGradient(0, panel.y, 0, panel.y + panel.h);
    grad.addColorStop(0, bg.top);
    grad.addColorStop(0.6, bg.mid);
    grad.addColorStop(0.78, bg.horizon);
    grad.addColorStop(0.78, bg.ground);
    grad.addColorStop(1, bg.ground);
    ctx.fillStyle = grad;
    ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
  }

  function drawPanel(level, panel, elements, state, time, isRight) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(panel.x, panel.y, panel.w, panel.h);
    ctx.clip();
    ctx.save();
    ctx.translate(panel.x, panel.y);
    drawPanelBackground(level, { x: 0, y: 0, w: panel.w, h: panel.h });
    for (const el of elements) drawElement(ctx, el, time);
    // Found rings on both panels; hint pulse on both panels too.
    for (const diff of level.diffs) {
      const found = state.found[diff.id];
      if (found) {
        ctx.strokeStyle = PALETTE.gold;
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(diff.x, diff.y, diff.r + 4, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = PALETTE.gold;
        ctx.beginPath(); ctx.arc(diff.x, diff.y, 5, 0, Math.PI * 2); ctx.fill();
      }
    }
    if (state.hintDiff !== null && state.hintPulse > 0) {
      const diff = level.diffs[state.hintDiff];
      const pulse = 1 + 0.18 * Math.sin(time * 6);
      ctx.strokeStyle = `rgba(242, 201, 76, ${0.55 + 0.45 * Math.sin(time * 6)})`;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(diff.x, diff.y, (diff.r + 8) * pulse, 0, Math.PI * 2); ctx.stroke();
    }
    // Wrong-click flash.
    if (state.flash && state.flash.age < 0.5) {
      const f = state.flash;
      const inThis = isRight
        ? f.px >= PANEL_RIGHT.x && f.px <= PANEL_RIGHT.x + PANEL_RIGHT.w
        : f.px >= PANEL_LEFT.x && f.px <= PANEL_LEFT.x + PANEL_LEFT.w;
      if (inThis) {
        const lx = f.px - panel.x, ly = f.py - panel.y;
        ctx.strokeStyle = `rgba(229, 83, 75, ${1 - f.age / 0.5})`;
        ctx.lineWidth = 4;
        const r = 12 + f.age * 60;
        ctx.beginPath();
        ctx.moveTo(lx - r, ly - r); ctx.lineTo(lx + r, ly + r);
        ctx.moveTo(lx + r, ly - r); ctx.lineTo(lx - r, ly + r);
        ctx.stroke();
      }
    }
    ctx.restore();
    ctx.restore();
    // Frame + label.
    ctx.strokeStyle = PALETTE.panelFrame;
    ctx.lineWidth = 4;
    ctx.strokeRect(panel.x, panel.y, panel.w, panel.h);
    ctx.fillStyle = PALETTE.panelLabel;
    ctx.fillRect(panel.x, panel.y, 74, 30);
    text(isRight ? 'KANAN' : 'KIRI', panel.x + 37, panel.y + 21, 16, PALETTE.text, 'center', 'bold');
  }

  function fmtTime(seconds) {
    const s = Math.max(0, Math.ceil(seconds));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  function drawTopbar(state, level) {
    ctx.fillStyle = PALETTE.topbar;
    ctx.fillRect(0, 0, FIELD.width, 92);
    ctx.textBaseline = 'alphabetic';
    text(`Level ${state.levelIndex + 1} · ${level.name}`, 24, 34, 24, PALETTE.text, 'left', 'bold');
    text(`Skor ${state.score}   ·   Kombo ×${Math.max(1, state.combo)}`, 24, 66, 19, PALETTE.muted);
    const urgent = state.timeLeft <= 15;
    text(fmtTime(state.timeLeft), FIELD.width / 2, 56, 44, urgent ? PALETTE.red : PALETTE.text, 'center', 'bold');
    text('waktu tersisa', FIELD.width / 2, 82, 15, PALETTE.muted, 'center');
    const remaining = level.diffs.length - state.foundCount;
    text(`${remaining} tersisa`, FIELD.width - 24, 34, 24, PALETTE.gold, 'right', 'bold');
    text(`dari ${level.diffs.length} perbedaan`, FIELD.width - 24, 66, 19, PALETTE.muted, 'right');
  }

  function drawButtons(state) {
    ctx.textBaseline = 'alphabetic';
    for (const [key, b] of Object.entries(BUTTONS)) {
      let label = b.label;
      if (key === 'hint') label = `Hint (H) · ${state.hintsLeft}`;
      if (key === 'mute') label = state.muted ? 'Suara Mati (M)' : 'Suara Nyala (M)';
      ctx.fillStyle = PALETTE.button;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = PALETTE.panelFrame;
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      text(label, b.x + b.w / 2, b.y + 27, 16, PALETTE.text, 'center');
    }
    text('Klik perbedaan di gambar KIRI atau KANAN  ·  R: mulai ulang  ·  P/Esc: jeda', FIELD.width / 2, 714, 14, PALETTE.muted, 'center');
  }

  function drawOverlayPanel(title, lines, prompt, accent = PALETTE.gold) {
    const w = 680, h = 130 + lines.length * 36 + 70;
    const x = (FIELD.width - w) / 2, y = (FIELD.height - h) / 2;
    ctx.fillStyle = PALETTE.overlay;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    ctx.fillStyle = '#241b3d';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);
    ctx.textBaseline = 'alphabetic';
    text(title, FIELD.width / 2, y + 72, 46, accent, 'center', 'bold');
    lines.forEach((line, i) => text(line, FIELD.width / 2, y + 122 + i * 36, 21, PALETTE.text, 'center'));
    text(prompt, FIELD.width / 2, y + h - 30, 20, PALETTE.gold, 'center');
  }

  /** Paint one frame. `state` is the world state; `screen` the current screen. */
  function draw(state, screen, best, time) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    const level = state.level;
    const right = rightElements(level);
    drawPanel(level, PANEL_LEFT, level.elements, state, time, false);
    drawPanel(level, PANEL_RIGHT, right, state, time, true);
    // "VS" badge between panels.
    ctx.fillStyle = PALETTE.gold;
    ctx.beginPath(); ctx.arc(640, 374, 26, 0, Math.PI * 2); ctx.fill();
    text('VS', 640, 382, 20, '#241b3d', 'center', 'bold');
    drawTopbar(state, level);
    drawButtons(state);

    if (screen === SCREEN_TITLE) {
      drawOverlayPanel('KEBUN SENJA', [
        'Temukan semua perbedaan antara gambar KIRI dan KANAN.',
        'Klik perbedaan untuk mendapat skor — klik salah mengurangi waktu 3 detik.',
        '3 level: Kebun Senja (7) · Pasar Senja (8) · Bukit Observatorium (10).',
        `Skor terbaik: ${best}`,
      ], 'Klik atau tekan Spasi untuk mulai');
    } else if (screen === SCREEN_PAUSED) {
      drawOverlayPanel('Jeda', ['Permainan dijeda. Waktumu menunggu.'], 'Tekan P atau klik untuk lanjut');
    } else if (screen === SCREEN_CLEAR) {
      const bonus = state.lastBonus ?? 0;
      drawOverlayPanel('Level Selesai!', [
        `Semua ${level.diffs.length} perbedaan ditemukan di ${level.name}.`,
        `Bonus waktu: +${bonus}   ·   Skor: ${state.score}`,
        state.levelIndex + 1 < 3 ? 'Level berikutnya menanti — lebih cepat, lebih banyak perbedaan.' : '',
      ].filter(Boolean), state.levelIndex + 1 < 3 ? 'Tekan Enter atau klik: level berikutnya' : 'Tekan Enter atau klik: lihat hasil akhir');
    } else if (screen === SCREEN_OVER) {
      drawOverlayPanel('Waktu Habis', [
        `Kamu menemukan ${state.foundCount} dari ${level.diffs.length} perbedaan di ${level.name}.`,
        `Skor: ${state.score}   ·   Skor terbaik: ${best}`,
      ], 'Tekan R atau klik untuk coba lagi', PALETTE.red);
    } else if (screen === SCREEN_WIN) {
      drawOverlayPanel('Kamu Menang!', [
        'Semua perbedaan di ketiga level ditemukan. Mata elang!',
        `Skor akhir: ${state.score}   ·   Skor terbaik: ${best}`,
      ], 'Tekan R atau klik untuk main lagi');
    }
  }

  function toField(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const px = (clientX - rect.left) * (canvas.width / rect.width);
    const py = (clientY - rect.top) * (canvas.height / rect.height);
    return { x: (px - view.x) / view.scale, y: (py - view.y) / view.scale };
  }

  resize();
  window.addEventListener('resize', resize);
  return { draw, toField, fmtTime };
}
