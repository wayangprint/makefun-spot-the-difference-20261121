// The screenshot scenes behind ?shot=start|play|play2|clear. Each one stages
// a real game state through the world's own rules (no fake pixels): the same
// shot always gives the same frame, so screenshots are reproducible.
//   start — title screen over level 1 (no differences found yet)
//   play  — level 1 mid-play: 3 found, 4 remaining, 87 s on the clock
//   play2 — level 2 mid-play: 2 found, one hint pulsing on a third difference
//   clear — level 1 cleared: all 7 found, time bonus added, score shown
import { SCREEN_CLEAR, SCREEN_PLAY, SCREEN_TITLE } from './render.js';

export function stageShot(name, world) {
  if (name === 'play') {
    world.resetAll();
    world.debugSetFound([0, 1, 5]);
    world.debugSetTimeLeft(87);
    return { screen: SCREEN_PLAY, best: 0 };
  }
  if (name === 'play2') {
    world.resetAll();
    world.startLevel(1);
    world.debugSetFound([0, 2]);
    world.debugSetTimeLeft(64);
    world.debugSetHint(4);
    return { screen: SCREEN_PLAY, best: 600 };
  }
  if (name === 'clear') {
    world.resetAll();
    world.debugSetFound([0, 1, 2, 3, 4, 5, 6]);
    world.debugSetTimeLeft(41);
    // Mirror the real clear path: time bonus on top of the find points.
    world.state.lastBonus = 41 * 10;
    world.state.score += world.state.lastBonus;
    return { screen: SCREEN_CLEAR, best: world.state.score };
  }
  world.resetAll();
  return { screen: SCREEN_TITLE, best: 1250 };
}
