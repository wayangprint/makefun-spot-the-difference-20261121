// Boot and the one loop: input is read every frame, the world advances in
// fixed 1/60 s steps, and the renderer paints what is there. The game moves
// between six screens: title, play, paused, level-clear, game over and win.
//
// ?shot=start|play|play2|clear stages that scene instead of running the loop,
// paints it twice and sets window.__shotReady for a screenshot.
// window.__game exposes the live state for automated playtesting.
import { BEST_KEY, BUTTONS, PANEL_LEFT, PANEL_RIGHT, STEP } from './config.js';
import { createWorld, EVENT_CLEAR, EVENT_FOUND, EVENT_TIMEOUT, EVENT_WRONG } from './world.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_PAUSE, ACTION_RESTART, createInput } from './input.js';
import { createAudio } from './audio.js';
import { createRenderer, SCREEN_CLEAR, SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './render.js';
import { stageShot } from './shots.js';

const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld();
const renderer = createRenderer(canvas);
const audio = createAudio();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

function runShot(name) {
  const scene = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world.state, scene.screen, scene.best, performance.now() / 1000);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let screen = SCREEN_TITLE;
  let best = readBest();
  let accumulator = 0;
  let last = performance.now();
  let elapsed = 0;

  function announce(message) {
    status.textContent = message;
  }

  function startGame() {
    world.resetAll();
    audio.unlock();
    screen = SCREEN_PLAY;
    announce(`Bermain. Level 1 ${world.state.level.name}: temukan ${world.state.level.diffs.length} perbedaan.`);
  }

  function nextLevel() {
    if (world.state.levelIndex + 1 < 3) {
      world.startLevel(world.state.levelIndex + 1);
      screen = SCREEN_PLAY;
      announce(`Level ${world.state.levelIndex + 1}: ${world.state.level.name}.`);
    } else {
      screen = SCREEN_WIN;
      audio.win();
      if (world.state.score > best) { best = world.state.score; saveBest(best); }
      announce(`Menang! Skor akhir ${world.state.score}.`);
    }
  }

  function endGame() {
    screen = SCREEN_OVER;
    audio.over();
    if (world.state.score > best) { best = world.state.score; saveBest(best); }
    announce(`Waktu habis. Skor ${world.state.score}. Skor terbaik ${best}.`);
  }

  function handleButtonClick(fx, fy) {
    const { hint, pause, mute } = BUTTONS;
    if (fx >= hint.x && fx <= hint.x + hint.w && fy >= hint.y && fy <= hint.y + hint.h) {
      if (screen === SCREEN_PLAY) {
        const id = world.useHint();
        if (id >= 0) { audio.hint(); announce('Hint: satu perbedaan sedang berdenyut.'); }
        else announce('Tidak ada hint tersisa.');
      }
      return true;
    }
    if (fx >= pause.x && fx <= pause.x + pause.w && fy >= pause.y && fy <= pause.y + pause.h) {
      if (screen === SCREEN_PLAY) { screen = SCREEN_PAUSED; announce('Jeda.'); }
      else if (screen === SCREEN_PAUSED) { screen = SCREEN_PLAY; announce('Lanjut.'); }
      return true;
    }
    if (fx >= mute.x && fx <= mute.x + mute.w && fy >= mute.y && fy <= mute.y + mute.h) {
      world.state.muted = !world.state.muted;
      audio.setMuted(world.state.muted);
      return true;
    }
    return false;
  }

  function handleClick(fx, fy) {
    audio.unlock();
    if (handleButtonClick(fx, fy)) return;
    if (screen === SCREEN_TITLE) { startGame(); return; }
    if (screen === SCREEN_CLEAR) { nextLevel(); return; }
    if (screen === SCREEN_OVER || screen === SCREEN_WIN) { startGame(); return; }
    if (screen === SCREEN_PAUSED) { screen = SCREEN_PLAY; announce('Lanjut.'); return; }
    if (screen !== SCREEN_PLAY) return;
    const events = world.clickAt(fx, fy);
    if (events & EVENT_FOUND) {
      audio.found(world.state.combo);
      announce(`Ketemu! ${world.state.level.diffs.length - world.state.foundCount} tersisa. Skor ${world.state.score}.`);
    }
    if (events & EVENT_WRONG) {
      audio.wrong();
      announce(`Bukan itu — waktu berkurang 3 detik. Sisa ${Math.ceil(world.state.timeLeft)} detik.`);
    }
    if (events & EVENT_CLEAR) {
      audio.clear();
      if (world.state.levelIndex + 1 >= 3) {
        // Last level cleared: straight to the win screen.
        screen = SCREEN_WIN;
        audio.win();
        if (world.state.score > best) { best = world.state.score; saveBest(best); }
        announce(`Menang! Skor akhir ${world.state.score}.`);
      } else {
        screen = SCREEN_CLEAR;
        announce(`Level selesai! Bonus waktu +${world.state.lastBonus}. Skor ${world.state.score}.`);
      }
    }
  }

  function handleActions() {
    const actions = input.takeActions();
    if (actions & ACTION_MUTE) {
      world.state.muted = !world.state.muted;
      audio.setMuted(world.state.muted);
    }
    if (actions & ACTION_RESTART && (screen === SCREEN_OVER || screen === SCREEN_WIN || screen === SCREEN_PLAY)) {
      startGame();
      return;
    }
    if (actions & ACTION_HINT && screen === SCREEN_PLAY) {
      const id = world.useHint();
      if (id >= 0) { audio.hint(); announce('Hint: satu perbedaan sedang berdenyut.'); }
    }
    if (actions & ACTION_PAUSE) {
      if (screen === SCREEN_PLAY) { screen = SCREEN_PAUSED; announce('Jeda.'); }
      else if (screen === SCREEN_PAUSED) { screen = SCREEN_PLAY; announce('Lanjut.'); }
    }
    if (actions & ACTION_CONFIRM) {
      if (screen === SCREEN_TITLE || screen === SCREEN_OVER || screen === SCREEN_WIN) startGame();
      else if (screen === SCREEN_CLEAR) nextLevel();
      else if (screen === SCREEN_PAUSED) screen = SCREEN_PLAY;
    }
    for (const click of input.takeClicks()) {
      const field = renderer.toField(click.x, click.y);
      handleClick(field.x, field.y);
    }
  }

  function step() {
    if (screen !== SCREEN_PLAY) return;
    const events = world.step(STEP);
    if (events & EVENT_TIMEOUT) endGame();
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    elapsed = now / 1000;
    handleActions();
    if (screen === SCREEN_PLAY) {
      while (accumulator >= STEP && screen === SCREEN_PLAY) {
        step();
        accumulator -= STEP;
      }
    } else {
      accumulator = 0;
    }
    renderer.draw(world.state, screen, best, elapsed);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Jeda.');
    }
  });

  window.__game = {
    state: world.state,
    get screen() { return screen; },
    get best() { return best; },
    start: startGame,
    clickAt: handleClick,
    useHint: () => world.useHint(),
    panels: { left: PANEL_LEFT, right: PANEL_RIGHT },
  };

  announce('Kebun Senja. Tekan Spasi atau klik untuk mulai.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
