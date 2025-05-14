import React from "react";
import { Todo } from "@/types";
import { useTodo } from "@/hooks/useTodo";

interface TodoItemProps {
  todo: Todo;
  isSelected?: boolean;
  small?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, isSelected }) => {
  const { toggleTodo, deleteTodo } = useTodo();

  return (
    <div
      onClick={() => toggleTodo(todo.id)}
      className={`flex items-center justify-between gap-4 px-4 py-3 rounded-2xl shadow-md transition-all duration-200 hover:cursor-pointer ${
        todo.completed ? "opacity-50 " : ""
      } ${
        isSelected
          ? "ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/40"
          : "bg-white dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-5 h-5  border-2 shrink-0 transition ${
            todo.completed
              ? "bg-green-500 border-green-500"
              : "border-gray-400 hover:border-blue-500"
          } ${isSelected ? "border-blue-500" : ""}`}
        />
        <span className="text-base sm:text-lg font-medium text-zinc-800 dark:text-zinc-100 break-words">
          {todo.title}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteTodo(todo.id);
        }}
        className="text-red-500 text-sm hover:underline"
      >
        ✖
      </button>
    </div>
  );
};

export default TodoItem;
