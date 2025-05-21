import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(initialSeconds: number, onExpire?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    setRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!running) return;
    if (secondsLeft === 0) {
      setRunning(false);
      onExpireRef.current?.();
      return;
    }
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0));
    }, 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const toggle = useCallback(() => setRunning((r) => !r), []);
  const reset = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setRunning(false);
  }, [initialSeconds]);
  const finish = useCallback(() => {
    setSecondsLeft(0);
    setRunning(false);
    onExpireRef.current?.();
  }, []);

  return {
    secondsLeft,
    running,
    start,
    pause,
    toggle,
    reset,
    finish,
  };
}
