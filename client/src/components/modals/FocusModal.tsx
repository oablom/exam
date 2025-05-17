import React, { useEffect, useState, useMemo, useLayoutEffect } from "react";
import { Todo } from "@/types";
import Modal from "./Modal";
import Button from "../Button";

/**
 * VisualTimer
 * - "disc": shrinking circular stroke (TimeTimer‑liknande)
 * - "bar": vertikal stapel med segment‑streck (delmål)
 *
 * Klicka på timern för att växla läge.
 */
const VisualTimer: React.FC<{
  secondsLeft: number;
  totalSeconds: number;
  mode: "disc" | "bar";
  size: number; // absolute px
  segmentSeconds: number; // length of each sub‑goal in seconds
  onToggleMode: () => void;
}> = ({
  secondsLeft,
  totalSeconds,
  mode,
  size,
  segmentSeconds,
  onToggleMode,
}) => {
  const pct = totalSeconds === 0 ? 0 : secondsLeft / totalSeconds;

  /** BAR mode with segment lines */
  if (mode === "bar") {
    const segments = Math.floor(totalSeconds / segmentSeconds);
    const segmentLines = Array.from({ length: segments - 1 }, (_, i) => {
      const posPct = ((i + 1) / segments) * 100;
      return (
        <div
          key={i}
          className="absolute left-0 right-0 h-px bg-zinc-300 opacity-70"
          style={{ bottom: `${posPct}%` }}
        />
      );
    });

    return (
      <button
        onClick={onToggleMode}
        title="Byt läge"
        className="relative focus:outline-none select-none"
        style={{ height: size, width: size / 5 }}
      >
        <div className="absolute inset-0 bg-zinc-200 rounded-lg overflow-hidden" />
        <div
          className="absolute left-0 right-0 bottom-0 bg-green-500 transition-all duration-1000 ease-linear"
          style={{ height: `${pct * 100}%` }}
        />
        {/* segment lines */}
        {segmentLines}
      </button>
    );
  }

  /** DISC mode */
  const radius = size / 2 - 12; // some padding
  const dashArray = 2 * Math.PI * radius;
  const dashOffset = dashArray * (1 - pct);

  return (
    <button
      onClick={onToggleMode}
      title="Byt läge"
      className="focus:outline-none select-none"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#16a34a"
          strokeWidth="12"
          fill="none"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
    </button>
  );
};

interface FocusModalProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (id: string) => void;
  initialTimerMode?: "disc" | "bar";
  segmentMinutes?: number; // length of each sub‑goal
}

const FocusModal: React.FC<FocusModalProps> = ({
  todo,
  isOpen,
  onClose,
  onComplete,
  initialTimerMode = "disc",
  segmentMinutes = 5,
}) => {
  const totalSeconds = useMemo(() => (todo?.estimatedTime ?? 0) * 60, [todo]);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"disc" | "bar">(initialTimerMode);
  const [size, setSize] = useState(240);

  /* Responsive size: 60% of viewport width, 40% of viewport height, cap at 320 */
  const computeSize = () =>
    Math.min(320, window.innerWidth * 0.6, window.innerHeight * 0.4);

  useLayoutEffect(() => {
    setSize(computeSize());
    const onResize = () => setSize(computeSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* reset when todo changes */
  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setRunning(false);
  }, [totalSeconds]);

  /* countdown */
  useEffect(() => {
    if (!running) return;
    if (secondsLeft === 0) {
      todo && onComplete(todo.id);
      setRunning(false);
      return;
    }
    const intv = setInterval(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0));
    }, 1000);
    return () => clearInterval(intv);
  }, [running, secondsLeft, todo, onComplete]);

  /* helpers */
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  const reset = () => {
    setSecondsLeft(totalSeconds);
    setRunning(false);
  };
  const finishEarly = () => {
    if (todo) onComplete(todo.id);
    setRunning(false);
  };

  /* UI */
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => {}}
      actionLabel=""
      title={todo ? `Fokus: ${todo.title}` : "Fokus"}
      body={
        <div className="flex flex-col items-center gap-6 py-4 w-full max-h-[65vh] overflow-y-auto">
          <VisualTimer
            secondsLeft={secondsLeft}
            totalSeconds={totalSeconds}
            mode={mode}
            onToggleMode={() => setMode((m) => (m === "disc" ? "bar" : "disc"))}
            size={size}
            segmentSeconds={segmentMinutes * 60}
          />
          <p className="text-5xl font-mono select-none">
            {formatTime(secondsLeft)}
          </p>
          <p className="text-sm text-zinc-500 text-center px-4">
            {running
              ? "Jobba på nu, du är så grym!"
              : "Klicka STARTA för att börja nedräkningen (klicka timern för att byta stil)"}
          </p>
        </div>
      }
      footer={
        <div className="flex flex-col gap-3 w-full items-center max-w-md m-auto">
          <Button
            label={running ? "⏸ Pausa" : "▶ Starta"}
            onClick={() => setRunning((v) => !v)}
            outline={false}
            className={`w-full text-white font-semibold text-xl py-4 rounded-full border-none ${
              running
                ? "bg-red-500 hover:bg-red-600 "
                : "bg-green-600 hover:bg-green-700"
            }`}
          />
          <div className="flex flex-row gap-2 w-full max-w-md">
            <Button
              label="Reset"
              outline
              onClick={reset}
              className="flex-1 bg-white hover:bg-zinc-300 text-zinc-800 font-medium py-3 rounded-full border-2 border-dotted border-zinc-600"
            />
            <Button
              label="Klart!"
              onClick={finishEarly}
              outline
              className="flex-1 bg-white text-zinc-800 font-medium py-3 rounded-full border-2 border-zinc-500 hover:bg-green-700 hover:border-green-700 hover:text-white"
            />
          </div>
        </div>
      }
    />
  );
};

export default FocusModal;
