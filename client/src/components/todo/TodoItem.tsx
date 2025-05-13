import React from "react";
import { TodoItemProps } from "@/types";

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  completed,
  onToggle,
  onDelete,
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-md transition-all duration-200 ${
        completed ? "opacity-50 line-through" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(id, !completed)}
          className={`w-5 h-5 rounded-full border-2 shrink-0 transition ${
            completed
              ? "bg-green-500 border-green-500"
              : "border-gray-400 hover:border-blue-500"
          }`}
        />
        <span className="text-base sm:text-lg font-medium text-zinc-800 dark:text-zinc-100 break-words">
          {title}
        </span>
      </div>

      <button
        onClick={() => onDelete(id)}
        className="text-zinc-400 hover:text-red-500 transition text-sm"
        aria-label="Ta bort todo"
      >
        ✖
      </button>
    </div>
  );
};

export default TodoItem;
