// Every tuning number, colour and layout constant in one place.
// The playfield is a fixed 1280x720 logical area; the renderer scales it to
// the window, so no rule below depends on the screen size.
export const FIELD = { width: 1280, height: 720 };

/** Fixed simulation step, in seconds. */
export const STEP = 1 / 60;

/** The two picture panels, in field coordinates. */
export const PANEL_LEFT = { x: 20, y: 104, w: 600, h: 540 };
export const PANEL_RIGHT = { x: 660, y: 104, w: 600, h: 540 };
export const PANEL_GAP_LABEL = { x: 640, y: 380 };

/** Bottom button bar (field coordinates). */
export const BUTTONS = {
  hint: { x: 430, y: 652, w: 150, h: 40, label: 'Hint (H)' },
  pause: { x: 600, y: 652, w: 130, h: 40, label: 'Jeda (P)' },
  mute: { x: 750, y: 652, w: 130, h: 40, label: 'Suara (M)' },
};

/** Points for a correct find at combo multiplier 1..5; wrong click costs time. */
export const SCORE = { base: 100, maxCombo: 5, timeBonusPerSecond: 10 };
export const WRONG_PENALTY_SECONDS = 3;
export const HINTS_PER_LEVEL = 3;

export const PALETTE = {
  backdrop: '#171226',
  topbar: '#241b3d',
  text: '#f5efe0',
  muted: '#b9aed4',
  gold: '#f2c94c',
  goldDim: '#a8842a',
  red: '#e5534b',
  panelFrame: '#3d2f5e',
  panelLabel: '#241b3d',
  button: '#3a2c5e',
  buttonHover: '#4a3a75',
  overlay: 'rgba(18, 12, 34, 0.82)',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'kebun-senja.best';
