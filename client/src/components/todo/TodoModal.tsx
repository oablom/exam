import { MouseEvent } from "react";
import TodoForm from "./TodoForm";
import { Todo } from "@/types";

interface TodoModalProps {
  isOpen: boolean;
  mode: "new" | "edit";
  todo?: Todo; // krävs vid edit
  onClose: () => void;
}

const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  mode,
  todo,
  onClose,
}) => {
  if (!isOpen) return null;

  const closeOnBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={closeOnBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <TodoForm mode={mode} todo={todo} onClose={onClose} />
    </div>
  );
};

export default TodoModal;
