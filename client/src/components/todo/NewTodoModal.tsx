import { MouseEvent } from "react";
import NewTodoForm from "./NewTodoForm";

interface NewTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTodoModal: React.FC<NewTodoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const closeOnBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={closeOnBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm "
    >
      <NewTodoForm onClose={onClose} />
    </div>
  );
};

export default NewTodoModal;
