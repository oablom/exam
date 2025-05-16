import React, { useEffect, useState } from "react";
import { Todo } from "@/types";
import Modal from "./Modal";
import Button from "../Button";

interface FocusModalProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (id: string) => void;
}

const FocusModal: React.FC<FocusModalProps> = ({
  todo,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);

  // Load todo time when it changes
  useEffect(() => {
    if (todo) {
      setSecondsLeft((todo.estimatedTime ?? 0) * 60);
      setRunning(false);
    }
  }, [todo]);

  // Countdown
  useEffect(() => {
    if (!running) return;
    if (secondsLeft === 0) {
      if (todo) onComplete(todo.id);
      setRunning(false);
      return;
    }
    const intv = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(intv);
  }, [running, secondsLeft, todo, onComplete]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStart = () => setRunning(true);
  const handleStop = () => setRunning(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => {}}
      actionLabel=""
      title={todo ? `Fokus: ${todo.title}` : "Fokus"}
      body={
        <div className="flex flex-col items-center gap-4 py-6">
          <p className="text-6xl font-mono">{formatTime(secondsLeft)}</p>
          <p className="text-sm text-zinc-500">
            Klicka start för att börja nedräkningen
          </p>
        </div>
      }
      footer={
        <div className="flex flex-col gap-3 mt-4 w-full  items-center">
          <Button
            label={running ? "⏸ Pausa" : "▶ Starta"}
            onClick={running ? handleStop : handleStart}
            className={`w-full text-white font-semibold text-lg py-3 rounded-full ${
              running
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-600 hover:bg-green-700"
            }`}
          />
        </div>
      }
    />
  );
};

export default FocusModal;
