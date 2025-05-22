import React, {
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
  useRef,
} from "react";
import confetti from "canvas-confetti";
import { playTimerEndBell, resumeAudioContext } from "@/utils/audioHelper";
import { Todo } from "@/types";
import Modal from "./Modal";
import Button from "../layout/Button";
import { Play, Pause, CheckCircle, RotateCcw } from "lucide-react";
import axios from "axios";
import { VITE_API_URL } from "@/lib/api";

const VisualTimer: React.FC<{
  secondsLeft: number;
  totalSeconds: number;
  mode: "disc" | "bar";
  size: number;
  segmentSeconds: number;
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

interface FocusModalProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (id: string) => void;
  initialTimerMode?: "disc" | "bar";
  segmentMinutes?: number;
}

const FocusModal: React.FC<FocusModalProps> = ({
  todo,
  isOpen,
  onClose,
  onComplete,
  initialTimerMode = "disc",
  segmentMinutes = 5,
}) => {
  const totalSeconds = useMemo(
    () => Math.round((todo?.estimatedTime ?? 0) * 60),
    [todo?.estimatedTime, todo?.id]
  );
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"disc" | "bar">(initialTimerMode);
  const [size, setSize] = useState(240);
  const [_expired, setExpired] = useState(false);
  const [expiredOnce, setExpiredOnce] = useState(false);
  const [manuallyFinished, setManuallyFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setRunning(false);
    setExpired(false);
  }, [totalSeconds, isOpen]);

  const handleExpire = () => {
    if (expiredOnce || manuallyFinished) return;
    setExpiredOnce(true);

    setExpired(true);
    playTimerEndBell();
    confetti({ particleCount: 15, spread: 40, origin: { y: 0.5 } });

    axios
      .post(
        `${VITE_API_URL}/api/schedule-focus-push`,
        {
          title: todo?.title || "Fokuspass klart",
          delayMs: 0,
        },
        { withCredentials: true }
      )
      .catch((err) => console.error("❌ Push-fel:", err));
  };

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setRunning(false);
    setExpired(false);
    setExpiredOnce(false);
  }, [totalSeconds, isOpen]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handleDone = () => {
    onComplete(todo!.id);
    setExpired(false);
    onClose();
  };

  const computeSize = () =>
    Math.min(320, window.innerWidth * 0.6, window.innerHeight * 0.4);

  useLayoutEffect(() => {
    setSize(computeSize());
    const onResize = () => setSize(computeSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSecondsLeft(totalSeconds);
    setRunning(false);
    setManuallyFinished(false);
    setExpiredOnce(false);
    setExpired(false);
  };

  const finishEarly = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setManuallyFinished(true);
    handleDone();
  };

  const toggleRun = () => {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      setManuallyFinished(false);
      setExpiredOnce(false);
      resumeAudioContext().then(() => setRunning(true));
    }
  };

  useEffect(() => {
    if (running && secondsLeft === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
      handleExpire();
    }
  }, [secondsLeft, running]);

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
          <p className="text-lg text-zinc-600 text-center px-4">
            {running
              ? "Jobba på nu, du är så grym!"
              : "Klicka STARTA för att börja nedräkningen (klicka timern för att byta stil)"}
          </p>
        </div>
      }
      footer={
        <div className="flex flex-col gap-3 w-full items-center max-w-md m-auto">
          <Button
            icon={running ? <Pause /> : <Play />}
            label={running ? "Pausa" : "Starta"}
            onClick={toggleRun}
            outline={false}
            className={`w-full text-white font-semibold text-xl py-4 rounded-full border-none `}
          />
          <div className="flex flex-row gap-2 w-full max-w-md">
            <Button
              icon={<RotateCcw />}
              label="Reset"
              outline
              onClick={reset}
              className="flex-1 bg-white hover:bg-zinc-300 text-zinc-800 font-medium py-3 rounded-full border-2 border-dotted border-zinc-600"
            />
            <Button
              icon={<CheckCircle />}
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
