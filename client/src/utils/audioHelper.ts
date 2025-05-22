const AudioContextClass =
  window.AudioContext ??
  (window as unknown as { webkitAudioContext: typeof AudioContext })
    .webkitAudioContext;

const ctx = new AudioContextClass();

export function resumeAudioContext() {
  if (ctx.state === "suspended") {
    return ctx.resume();
  }
  return Promise.resolve();
}

export function playBeep(
  freq: number,
  length: number,
  type: OscillatorType = "sine"
) {
  resumeAudioContext().then(() => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + length);
    setTimeout(() => osc.stop(), length * 1000 + 50);
  });
}

export const playCompletionBeep = () => playBeep(523.25, 0.1, "sine");
export const playTimerEndBell = () => {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => playBeep(440, 0.1, "sine"), i * 200);
  }
};
