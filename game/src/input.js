// Keyboard and pointer input. One-shot presses (start, pause, hint, mute,
// restart) are queued as bit flags and taken once by the loop, so a press
// between two frames is never lost and never counted twice. Pointer clicks
// are queued with their canvas coordinates for the loop to map to the field.
export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_HINT = 4;
export const ACTION_MUTE = 8;
export const ACTION_RESTART = 16;

const CONFIRM = new Set(['Space', 'Enter']);
const PAUSE = new Set(['KeyP', 'Escape']);
const HINT = new Set(['KeyH']);
const MUTE = new Set(['KeyM']);
const RESTART = new Set(['KeyR']);

export function createInput(target) {
  let actions = 0;
  let clicks = [];

  window.addEventListener('keydown', (event) => {
    if (CONFIRM.has(event.code)) {
      if (!event.repeat) actions |= ACTION_CONFIRM;
    } else if (PAUSE.has(event.code)) {
      if (!event.repeat) actions |= ACTION_PAUSE;
    } else if (HINT.has(event.code)) {
      if (!event.repeat) actions |= ACTION_HINT;
    } else if (MUTE.has(event.code)) {
      if (!event.repeat) actions |= ACTION_MUTE;
    } else if (RESTART.has(event.code)) {
      if (!event.repeat) actions |= ACTION_RESTART;
    } else return;
    event.preventDefault();
  });
  target.addEventListener('pointerdown', (event) => {
    clicks.push({ x: event.clientX, y: event.clientY });
  });

  return {
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
    takeClicks() {
      const taken = clicks;
      clicks = [];
      return taken;
    },
  };
}
