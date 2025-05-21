import React from "react";

interface VisualTimerProps {
  secondsLeft: number;
  totalSeconds: number;
  mode: "disc" | "bar";
  size: number;
  segmentSeconds: number;
  onToggleMode: () => void;
}

const VisualTimer: React.FC<VisualTimerProps> = ({
  secondsLeft,
  totalSeconds,
  mode,
  size,
  segmentSeconds,
  onToggleMode,
}) => {
  const pct = totalSeconds === 0 ? 0 : secondsLeft / totalSeconds;

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
        {segmentLines}
      </button>
    );
  }

  const radius = size / 2 - 12;
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

export default VisualTimer;
