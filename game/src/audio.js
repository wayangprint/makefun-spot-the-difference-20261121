// Synthesised sound effects with WebAudio: no audio files, no network.
// The context is created lazily on the first user gesture (browsers block
// audio before one); every call before that is a safe no-op.
export function createAudio() {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch {
      return null;
    }
    return ctx;
  }

  function tone(freq, startAt, duration, type = 'sine', volume = 0.16) {
    const ac = ensure();
    if (!ac || muted) return;
    try {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ac.currentTime + startAt);
      gain.gain.linearRampToValueAtTime(volume, ac.currentTime + startAt + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + startAt + duration);
      osc.connect(gain).connect(ac.destination);
      osc.start(ac.currentTime + startAt);
      osc.stop(ac.currentTime + startAt + duration + 0.05);
    } catch {
      // Sound is garnish: never let it break the game.
    }
  }

  return {
    unlock() { ensure(); },
    setMuted(value) { muted = value; },
    isMuted() { return muted; },
    /** Two-note chime for a found difference; higher with the combo. */
    found(combo) {
      const base = 660 + Math.min(combo, 5) * 40;
      tone(base, 0, 0.18, 'sine', 0.18);
      tone(base * 1.5, 0.09, 0.24, 'sine', 0.18);
    },
    /** Low buzz for a wrong click. */
    wrong() { tone(140, 0, 0.22, 'sawtooth', 0.12); },
    /** Soft ping when a hint is used. */
    hint() { tone(880, 0, 0.15, 'triangle', 0.14); tone(1174, 0.1, 0.18, 'triangle', 0.12); },
    /** Little arpeggio for clearing a level. */
    clear() { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.09, 0.22, 'sine', 0.16)); },
    /** Short fanfare for winning the whole game. */
    win() { [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, i * 0.11, 0.3, 'sine', 0.16)); },
    /** Sad two-note fall for running out of time. */
    over() { tone(392, 0, 0.25, 'sine', 0.14); tone(262, 0.18, 0.4, 'sine', 0.14); },
    click() { tone(520, 0, 0.06, 'triangle', 0.08); },
  };
}
