import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import ConfirmModal from "../modals/ConfirmModal";

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  completed,
  onToggle,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    onDelete(id);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between w-full max-w-md bg-white p-3 rounded shadow">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggle(id)}
          />
          <span
            className={`text-lg ${
              completed ? "line-through text-gray-500" : ""
            }`}
          >
            {title}
          </span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Ta bort uppgift?"
        message="Detta går inte att ångra."
        confirmLabel="Ta bort"
        cancelLabel="Avbryt"
      />
    </>
  );
};

export default TodoItem;
