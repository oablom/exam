const AudioContextClass: {
  new (): AudioContext;
} = (window.AudioContext ?? (window as any).webkitAudioContext) as any;

export const playCompletionBeep = (() => {
  const ctx = new AudioContextClass();

  return () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = 523.25;
    gain.gain.setValueAtTime(0.4, ctx.currentTime);

    osc.start();

    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    setTimeout(() => {
      osc.stop();
    }, 150);
  };
})();
