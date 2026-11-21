// The game's rules and state, with no drawing and no browser in it:
// levels, found differences, score and combo, the countdown, hints and
// click testing. step() advances one fixed step and returns what happened
// as bit flags, so the caller can react (and play sounds) without the world
// knowing about screens or sound.
import { HINTS_PER_LEVEL, PANEL_LEFT, PANEL_RIGHT, SCORE, WRONG_PENALTY_SECONDS } from './config.js';
import { LEVELS } from './scenes.js';

export const EVENT_FOUND = 1;
export const EVENT_WRONG = 2;
export const EVENT_TIMEOUT = 4;
export const EVENT_CLEAR = 8;

function inPanel(p, x, y) {
  return x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h;
}

export function createWorld() {
  const state = {
    levelIndex: 0,
    level: LEVELS[0],
    found: [],
    foundCount: 0,
    score: 0,
    combo: 0,
    bestCombo: 0,
    timeLeft: LEVELS[0].timeLimit,
    hintsLeft: HINTS_PER_LEVEL,
    hintDiff: null,
    hintPulse: 0,
    flash: null,
    muted: false,
    lastBonus: 0,
    totalFound: 0,
  };

  function startLevel(index) {
    state.levelIndex = index;
    state.level = LEVELS[index];
    state.found = state.level.diffs.map(() => false);
    state.foundCount = 0;
    state.combo = 0;
    state.timeLeft = state.level.timeLimit;
    state.hintsLeft = HINTS_PER_LEVEL;
    state.hintDiff = null;
    state.hintPulse = 0;
    state.flash = null;
    state.lastBonus = 0;
  }

  function resetAll() {
    state.score = 0;
    state.bestCombo = 0;
    state.totalFound = 0;
    startLevel(0);
  }

  /** A click in field coordinates. Returns an event flag (0 when ignored). */
  function clickAt(x, y) {
    let panel = null;
    if (inPanel(PANEL_LEFT, x, y)) panel = PANEL_LEFT;
    else if (inPanel(PANEL_RIGHT, x, y)) panel = PANEL_RIGHT;
    if (!panel) return 0;
    const lx = x - panel.x;
    const ly = y - panel.y;
    for (const diff of state.level.diffs) {
      if (state.found[diff.id]) continue;
      const dx = lx - diff.x, dy = ly - diff.y;
      if (dx * dx + dy * dy <= diff.r * diff.r) {
        state.found[diff.id] = true;
        state.foundCount += 1;
        state.totalFound += 1;
        state.combo = Math.min(state.combo + 1, SCORE.maxCombo);
        state.bestCombo = Math.max(state.bestCombo, state.combo);
        state.score += SCORE.base * state.combo;
        if (state.hintDiff === diff.id) { state.hintDiff = null; state.hintPulse = 0; }
        if (state.foundCount === state.level.diffs.length) {
          const bonus = Math.floor(state.timeLeft) * SCORE.timeBonusPerSecond;
          state.lastBonus = bonus;
          state.score += bonus;
          return EVENT_FOUND | EVENT_CLEAR;
        }
        return EVENT_FOUND;
      }
    }
    // Wrong click: red flash, combo resets, time penalty.
    state.combo = 0;
    state.timeLeft = Math.max(0, state.timeLeft - WRONG_PENALTY_SECONDS);
    state.flash = { px: x, py: y, age: 0 };
    if (state.timeLeft <= 0) return EVENT_WRONG | EVENT_TIMEOUT;
    return EVENT_WRONG;
  }

  /** Use one hint: pulse an unfound difference. Returns the diff id or -1. */
  function useHint() {
    if (state.hintsLeft <= 0) return -1;
    const remaining = state.level.diffs.filter((d) => !state.found[d.id]);
    if (remaining.length === 0) return -1;
    state.hintsLeft -= 1;
    // Pulse the first remaining difference (deterministic, fair).
    state.hintDiff = remaining[0].id;
    state.hintPulse = 3;
    return state.hintDiff;
  }

  /** One fixed step; only the countdown runs here. */
  function step(dt) {
    let events = 0;
    state.timeLeft = Math.max(0, state.timeLeft - dt);
    if (state.hintPulse > 0) state.hintPulse = Math.max(0, state.hintPulse - dt);
    if (state.flash) {
      state.flash.age += dt;
      if (state.flash.age >= 0.5) state.flash = null;
    }
    if (state.timeLeft <= 0) events |= EVENT_TIMEOUT;
    return events;
  }

  // Deterministic staging hooks used by shots.js (screenshots) only.
  function debugSetFound(ids) {
    for (const id of ids) {
      if (!state.found[id]) {
        state.found[id] = true;
        state.foundCount += 1;
        state.totalFound += 1;
      }
    }
    state.combo = Math.min(ids.length, SCORE.maxCombo);
    state.score = ids.reduce((sum, _id, i) => sum + SCORE.base * Math.min(i + 1, SCORE.maxCombo), 0);
  }
  function debugSetTimeLeft(seconds) { state.timeLeft = seconds; }
  function debugSetHint(id) { state.hintDiff = id; state.hintPulse = 3; }

  resetAll();
  return { state, startLevel, resetAll, clickAt, useHint, step, debugSetFound, debugSetTimeLeft, debugSetHint };
}
