import React from "react";
import { TodoActionsProps } from "@/types";

const TodoActions: React.FC<TodoActionsProps> = ({
  selectedIds,
  todos,
  onClear,
  onDelete,
  onComplete,
}) => {
  if (!selectedIds || selectedIds.length === 0) return null;

  const selectedTodos = todos.filter((todo) => selectedIds.includes(todo.id));
  const allAreCompleted = selectedTodos.every((todo) => todo.completed);

  const newValue = !allAreCompleted;

  return (
    <div className="flex gap-3 items-center justify-center p-3 bg-zinc-100 dark:bg-zinc-700 rounded-2xl shadow-inner">
      <button
        onClick={() => onDelete(selectedIds)}
        className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
      >
        🗑 Radera ({selectedIds.length})
      </button>
      <button
        onClick={() => onComplete(selectedIds, newValue)}
        className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
      >
        {allAreCompleted ? "↩ Ångra klarmarkering" : "✅ Klarmarkera"}
      </button>

      <button
        onClick={onClear}
        className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        Avbryt
      </button>
    </div>
  );
};

export default TodoActions;
