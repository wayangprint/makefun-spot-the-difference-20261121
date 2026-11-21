// Scene definitions for KEBUN SENJA: three data-driven levels.
// Every picture is a list of elements drawn by render.js from these props.
// A "difference" changes the RIGHT panel only: it hides one element, patches
// one element's props, or adds an extra element. Each difference carries its
// click point (panel-local x, y and radius r) so the world can test clicks.
//
// Panel-local coordinates: 600 wide x 540 tall, origin at the panel's top-left.

export const LEVELS = [
  {
    id: 'kebun',
    name: 'Kebun Senja',
    subtitle: 'Taman senja: kolam koi, lentera batu, dan kucing di pagar',
    timeLimit: 120,
    bg: { top: '#3a2a5e', mid: '#a34a6e', horizon: '#f2a65a', ground: '#2e4a2f', groundLine: 400 },
    elements: [
      { id: 'moon', kind: 'moon', x: 480, y: 80, r: 34, color: '#f7e8c3' },
      { id: 's1', kind: 'star', x: 60, y: 60, r: 3, color: '#fff3c4' },
      { id: 's2', kind: 'star', x: 150, y: 40, r: 2, color: '#ffffff' },
      { id: 's3', kind: 'star', x: 260, y: 55, r: 3, color: '#fff3c4' },
      { id: 's4', kind: 'star', x: 380, y: 35, r: 2, color: '#ffffff' },
      { id: 's5', kind: 'star', x: 540, y: 140, r: 2, color: '#ffffff' },
      { id: 's6', kind: 'star', x: 40, y: 150, r: 2, color: '#fff3c4' },
      { id: 'c1', kind: 'cloud', x: 140, y: 64, w: 110, h: 22, color: '#7a5a8a' },
      { id: 'c2', kind: 'cloud', x: 370, y: 46, w: 84, h: 18, color: '#8a6a9a' },
      { id: 'tree', kind: 'tree', x: 95, y: 300, s: 1.0 },
      { id: 'fence', kind: 'fence', x: 0, y: 330, w: 600 },
      { id: 'cat', kind: 'cat', x: 430, y: 318, s: 1.0, color: '#3a3a44' },
      { id: 'bush1', kind: 'bush', x: 60, y: 470, r: 46, color: '#24401f' },
      { id: 'bush2', kind: 'bush', x: 545, y: 480, r: 40, color: '#24401f' },
      { id: 'pond', kind: 'pond', x: 300, y: 445, rx: 175, ry: 52, color: '#2c5a7a' },
      { id: 'koi1', kind: 'koi', x: 235, y: 440, s: 1.0, color: '#ff8c42', dir: 1 },
      { id: 'koi2', kind: 'koi', x: 310, y: 452, s: 0.9, color: '#f5f0e6', dir: -1 },
      { id: 'koi3', kind: 'koi', x: 375, y: 432, s: 0.85, color: '#e5534b', dir: 1 },
      { id: 'lantern', kind: 'stoneLantern', x: 505, y: 395, s: 1.0, flame: '#ff9d2e' },
      { id: 'fl1', kind: 'flower', x: 120, y: 492, s: 1.0, petal: '#ff7fa5', center: '#ffd23f' },
      { id: 'fl2', kind: 'flower', x: 185, y: 508, s: 0.9, petal: '#c77dff', center: '#ffd23f' },
      { id: 'fl3', kind: 'flower', x: 255, y: 498, s: 1.0, petal: '#ff7fa5', center: '#ffd23f' },
      { id: 'fl4', kind: 'flower', x: 450, y: 492, s: 1.0, petal: '#ffd23f', center: '#e5534b' },
      { id: 'fl5', kind: 'flower', x: 525, y: 470, s: 0.85, petal: '#c77dff', center: '#ffd23f' },
      { id: 'bfly', kind: 'butterfly', x: 205, y: 185, s: 1.0, color: '#ff9d2e' },
      { id: 'ff1', kind: 'firefly', x: 150, y: 250, r: 4, color: '#ffe66d' },
      { id: 'ff2', kind: 'firefly', x: 340, y: 210, r: 3, color: '#ffe66d' },
      { id: 'ff3', kind: 'firefly', x: 480, y: 260, r: 4, color: '#ffe66d' },
      { id: 'ff4', kind: 'firefly', x: 90, y: 180, r: 3, color: '#ffe66d' },
      { id: 'rock1', kind: 'rock', x: 180, y: 535, s: 1.0, color: '#5a5a66' },
    ],
    diffs: [
      { id: 0, x: 480, y: 80, r: 36, label: 'Bulan hilang', hide: 'moon' },
      { id: 1, x: 310, y: 452, r: 24, label: 'Ikan koi hilang', hide: 'koi2' },
      { id: 2, x: 505, y: 372, r: 22, label: 'Api lentera berubah biru', patch: { id: 'lantern', props: { flame: '#7ec8ff' } } },
      { id: 3, x: 450, y: 492, r: 20, label: 'Bunga kuning hilang', hide: 'fl4' },
      { id: 4, x: 260, y: 150, r: 24, label: 'Kupu-kupu pindah', patch: { id: 'bfly', props: { x: 260, y: 150 } } },
      { id: 5, x: 430, y: 318, r: 28, label: 'Kucing hilang', hide: 'cat' },
      { id: 6, x: 265, y: 295, r: 18, label: 'Kunang-kunang tambahan', add: { id: 'ffX', kind: 'firefly', x: 265, y: 295, r: 4, color: '#ffe66d' } },
    ],
  },
  {
    id: 'pasar',
    name: 'Pasar Senja',
    subtitle: 'Kios lampion malam: dagangan, bendera, dan lampu gantung',
    timeLimit: 100,
    bg: { top: '#141a3a', mid: '#2c2a5e', horizon: '#7a3a5e', ground: '#3a2a1e', groundLine: 420 },
    elements: [
      { id: 'moon', kind: 'moon', x: 520, y: 60, r: 22, color: '#f7e8c3' },
      { id: 's1', kind: 'star', x: 80, y: 50, r: 2, color: '#ffffff' },
      { id: 's2', kind: 'star', x: 250, y: 35, r: 3, color: '#fff3c4' },
      { id: 's3', kind: 'star', x: 430, y: 45, r: 2, color: '#ffffff' },
      { id: 's4', kind: 'star', x: 580, y: 120, r: 2, color: '#fff3c4' },
      { id: 'wire', kind: 'wire', x: 0, y: 70, w: 600 },
      { id: 'flag1', kind: 'flag', x: 60, y: 70, s: 1.0, color: '#e5534b' },
      { id: 'flag2', kind: 'flag', x: 120, y: 70, s: 1.0, color: '#f2c94c' },
      { id: 'flag3', kind: 'flag', x: 180, y: 70, s: 1.0, color: '#3aa0a0' },
      { id: 'flag4', kind: 'flag', x: 240, y: 70, s: 1.0, color: '#3aa0ff' },
      { id: 'flag5', kind: 'flag', x: 300, y: 70, s: 1.0, color: '#e5534b' },
      { id: 'flag6', kind: 'flag', x: 360, y: 70, s: 1.0, color: '#f2c94c' },
      { id: 'flag7', kind: 'flag', x: 420, y: 70, s: 1.0, color: '#3aa0a0' },
      { id: 'flag8', kind: 'flag', x: 480, y: 70, s: 1.0, color: '#3aa0ff' },
      { id: 'bulb1', kind: 'bulb', x: 180, y: 100, r: 6, color: '#ffe66d' },
      { id: 'bulb2', kind: 'bulb', x: 330, y: 100, r: 6, color: '#ffe66d' },
      { id: 'bulb3', kind: 'bulb', x: 470, y: 100, r: 6, color: '#ffe66d' },
      { id: 'pl1', kind: 'paperLantern', x: 110, y: 135, r: 26, color: '#e5534b' },
      { id: 'pl2', kind: 'paperLantern', x: 210, y: 125, r: 22, color: '#f2c94c' },
      { id: 'pl3', kind: 'paperLantern', x: 300, y: 138, r: 26, color: '#e5534b' },
      { id: 'pl4', kind: 'paperLantern', x: 400, y: 125, r: 22, color: '#3aa0a0' },
      { id: 'pl5', kind: 'paperLantern', x: 500, y: 135, r: 26, color: '#f2c94c' },
      { id: 'lamp', kind: 'hangLamp', x: 300, y: 185, s: 1.0, flame: '#ff9d2e' },
      { id: 'sign', kind: 'sign', x: 300, y: 255, w: 150, h: 40, text: 'LAMPION', color: '#5e3a1e' },
      { id: 'vendor', kind: 'vendor', x: 140, y: 330, s: 1.0, shirt: '#3a6fd8', hat: '#e8c87a' },
      { id: 'stall1', kind: 'stall', x: 140, y: 400, w: 220, h: 110, awning: '#c0392b', body: '#6e4520' },
      { id: 'stall2', kind: 'stall', x: 460, y: 400, w: 220, h: 110, awning: '#2a7a7a', body: '#6e4520' },
      { id: 'crate1', kind: 'crate', x: 60, y: 500, s: 1.0, color: '#8a6a3a' },
      { id: 'crate2', kind: 'crate', x: 545, y: 490, s: 0.9, color: '#8a6a3a' },
      { id: 'basket1', kind: 'basket', x: 250, y: 495, s: 1.0, color: '#a8763e' },
      { id: 'o1', kind: 'orange', x: 232, y: 480, r: 11, color: '#ff8c42' },
      { id: 'o2', kind: 'orange', x: 255, y: 474, r: 11, color: '#ff8c42' },
      { id: 'o3', kind: 'orange', x: 274, y: 482, r: 11, color: '#ff8c42' },
      { id: 'basket2', kind: 'basket', x: 385, y: 500, s: 1.0, color: '#a8763e' },
      { id: 'o4', kind: 'orange', x: 372, y: 486, r: 11, color: '#ff8c42' },
      { id: 'o5', kind: 'orange', x: 396, y: 482, r: 11, color: '#ff8c42' },
    ],
    diffs: [
      { id: 0, x: 300, y: 138, r: 28, label: 'Lampion merah hilang', hide: 'pl3' },
      { id: 1, x: 140, y: 358, r: 30, label: 'Atap kios berubah hijau', patch: { id: 'stall1', props: { awning: '#2a9d4a' } } },
      { id: 2, x: 255, y: 474, r: 16, label: 'Satu jeruk hilang', hide: 'o2' },
      { id: 3, x: 240, y: 82, r: 16, label: 'Bendera berubah kuning', patch: { id: 'flag4', props: { color: '#ffd23f' } } },
      { id: 4, x: 300, y: 185, r: 20, label: 'Api lampu berubah hijau', patch: { id: 'lamp', props: { flame: '#7dff8a' } } },
      { id: 5, x: 470, y: 515, r: 22, label: 'Peti tambahan', add: { id: 'crateX', kind: 'crate', x: 470, y: 515, s: 0.9, color: '#8a6a3a' } },
      { id: 6, x: 330, y: 100, r: 14, label: 'Lampu gantung hilang', hide: 'bulb2' },
      { id: 7, x: 140, y: 312, r: 20, label: 'Topi pedagang berubah merah', patch: { id: 'vendor', props: { hat: '#e5534b' } } },
    ],
  },
  {
    id: 'observatorium',
    name: 'Bukit Observatorium',
    subtitle: 'Langit malam: teleskop, planet, dan hujan meteor',
    timeLimit: 90,
    bg: { top: '#070a1e', mid: '#12163a', horizon: '#2c2a5e', ground: '#16241a', groundLine: 420 },
    elements: [
      { id: 'band', kind: 'band', x: 60, y: 60, w: 480, h: 60, angle: 18, color: 'rgba(200, 190, 255, 0.14)' },
      { id: 's1', kind: 'star', x: 90, y: 90, r: 3, color: '#ffffff' },
      { id: 's2', kind: 'star', x: 200, y: 50, r: 2, color: '#fff3c4' },
      { id: 's3', kind: 'star', x: 300, y: 60, r: 4, color: '#ffffff' },
      { id: 's4', kind: 'star', x: 420, y: 40, r: 2, color: '#ffffff' },
      { id: 's5', kind: 'star', x: 560, y: 90, r: 3, color: '#fff3c4' },
      { id: 's6', kind: 'star', x: 150, y: 200, r: 2, color: '#ffffff' },
      { id: 's7', kind: 'star', x: 460, y: 180, r: 2, color: '#ffffff' },
      { id: 's8', kind: 'star', x: 60, y: 260, r: 2, color: '#fff3c4' },
      { id: 'saturn', kind: 'planet', x: 500, y: 120, r: 30, color: '#e8c87a', ring: true },
      { id: 'mars', kind: 'planet', x: 170, y: 110, r: 22, color: '#d96a4a', ring: false },
      { id: 'meteor', kind: 'meteor', x: 350, y: 80, len: 70, angle: 35, color: '#ffe66d' },
      { id: 'sat', kind: 'satellite', x: 520, y: 210, s: 1.0, color: '#c8c8d8' },
      { id: 'const', kind: 'constellation', points: [[120, 180], [170, 150], [220, 175], [260, 140]], color: '#9ab8ff' },
      { id: 'dome', kind: 'dome', x: 150, y: 400, s: 1.0, color: '#d8d8e8', window: true },
      { id: 'scope', kind: 'telescope', x: 410, y: 390, s: 1.0, angle: -35, color: '#c8c8d8' },
      { id: 'pine1', kind: 'pine', x: 60, y: 470, s: 1.0, color: '#1e3a24' },
      { id: 'pine2', kind: 'pine', x: 560, y: 470, s: 1.1, color: '#1e3a24' },
      { id: 'pine3', kind: 'pine', x: 95, y: 505, s: 0.8, color: '#24401f' },
      { id: 'stone1', kind: 'stone', x: 300, y: 520, r: 14, color: '#5a5a66' },
      { id: 'stone2', kind: 'stone', x: 340, y: 505, r: 11, color: '#5a5a66' },
      { id: 'rock1', kind: 'rock', x: 480, y: 520, s: 1.0, color: '#4a4a55' },
    ],
    diffs: [
      { id: 0, x: 500, y: 120, r: 34, label: 'Cincin Saturnus hilang', patch: { id: 'saturn', props: { ring: false } } },
      { id: 1, x: 350, y: 80, r: 26, label: 'Meteor hilang', hide: 'meteor' },
      { id: 2, x: 300, y: 60, r: 16, label: 'Bintang terang hilang', hide: 's3' },
      { id: 3, x: 470, y: 365, r: 26, label: 'Teleskop menunjuk lain', patch: { id: 'scope', props: { angle: -10 } } },
      { id: 4, x: 150, y: 380, r: 20, label: 'Jendela kubah gelap', patch: { id: 'dome', props: { window: false } } },
      { id: 5, x: 520, y: 210, r: 24, label: 'Satelit hilang', hide: 'sat' },
      { id: 6, x: 170, y: 110, r: 24, label: 'Mars berubah biru', patch: { id: 'mars', props: { color: '#7ea8ff' } } },
      { id: 7, x: 300, y: 480, r: 24, label: 'Pohon pinus tambahan', add: { id: 'pineX', kind: 'pine', x: 300, y: 480, s: 0.9, color: '#1e3a24' } },
      { id: 8, x: 190, y: 160, r: 30, label: 'Garis rasi hilang', hide: 'const' },
      { id: 9, x: 340, y: 505, r: 16, label: 'Batu jalan hilang', hide: 'stone2' },
    ],
  },
];

/** Elements of a level as they appear on the RIGHT panel (all diffs applied). */
export function rightElements(level) {
  const hidden = new Set();
  const patches = new Map();
  const adds = [];
  for (const diff of level.diffs) {
    if (diff.hide) hidden.add(diff.hide);
    if (diff.patch) patches.set(diff.patch.id, diff.patch.props);
    if (diff.add) adds.push(diff.add);
  }
  const out = [];
  for (const el of level.elements) {
    if (hidden.has(el.id)) continue;
    const patch = patches.get(el.id);
    out.push(patch ? { ...el, ...patch } : el);
  }
  return out.concat(adds);
}
