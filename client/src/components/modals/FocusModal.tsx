import React, { useEffect, useState } from "react";
import { Todo } from "@/types";
import Modal from "../modals/Modal";

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
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (todo?.estimatedTime) {
      setTimeLeft(todo.estimatedTime * 60); // convert min to sec
    }
  }, [todo]);

  useEffect(() => {
    if (!active || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [active, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleDone = () => {
    if (todo) onComplete(todo.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🎯 Fokusläge"
      actionLabel="Klar"
      onSubmit={handleDone}
      body={
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-bold">{todo?.title}</h2>
          <p className="text-zinc-500">Prioritet: {todo?.priority}</p>
          <p className="text-2xl font-mono">{formatTime(timeLeft)}</p>
          <button
            onClick={() => setActive(!active)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {active ? "Pausa" : "Starta"}
          </button>
        </div>
      }
    />
  );
};

export default FocusModal;
