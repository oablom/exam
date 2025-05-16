import React, { useState } from "react";
import { CheckCircle, Circle, Trash2 } from "lucide-react";
import { TodoItemProps } from "@/types";

// Helpers ----------------------------------------------
const priorityLabel = (p: 1 | 2 | 3) =>
  p === 1 ? "Hög" : p === 2 ? "Mellan" : "Låg";

const getDeadlineLabel = (iso?: string) => {
  if (!iso) return "Ingen";
  const date = new Date(iso);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const dayMs = 86_400_000;

  if (diffMs === 0) return "Idag";
  if (diffMs === dayMs) return "Imorgon";
  if (diffMs > 0 && diffMs <= 6 * dayMs) return "Den här veckan";
  if (diffMs > 6 * dayMs && diffMs <= 13 * dayMs) return "Nästa vecka";

  return date.toLocaleDateString("sv-SE");
};
// ------------------------------------------------------

const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed, priority, estimatedTime, dueDate },
  isSelected,
  onSelectToggle,
  onDelete,
  onFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen((p) => !p)}
      className={`flex flex-col gap-2 p-4 rounded-2xl shadow-md transition-all duration-200
        hover:cursor-pointer focus-visible:outline-none
        ${completed ? "opacity-50" : ""}
        ${
          isSelected
            ? "ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/40"
            : "bg-white dark:bg-zinc-800"
        }`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        {/* Checkbox */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectToggle(id);
          }}
          className="shrink-0 cursor-pointer select-none"
        >
          {isSelected ? (
            <CheckCircle size={26} className="text-blue-500" />
          ) : (
            <Circle size={26} />
          )}
        </div>

        {/* Title */}
        <p
          className={`flex-1 mx-3 font-semibold text-lg truncate ${
            completed ? "line-through" : ""
          }`}
        >
          {title}
        </p>

        {/* Delete */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onDelete([id]);
          }}
          className="ml-2 shrink-0 text-zinc-400 hover:text-red-500 cursor-pointer transition-colors hover:animate-wiggle"
        >
          <Trash2 size={20} />
        </div>
      </div>

      {/* Expanded */}
      {isOpen && (
        <div className="flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-300 ml-8">
          <span className="flex items-center gap-1">
            📌 <span className="font-medium">Prio:</span>{" "}
            {priorityLabel(priority)}
          </span>

          {estimatedTime !== undefined && (
            <span className="flex items-center gap-1">
              ⏱️ <span className="font-medium">Tid:</span> {estimatedTime} min
            </span>
          )}

          {dueDate && (
            <span className="flex items-center gap-1">
              📅 <span className="font-medium">Deadline:</span>{" "}
              {getDeadlineLabel(dueDate)}
            </span>
          )}
          {/* <div className="flex justify-center w-full"> */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFocus({
                id,
                title,
                completed,
                priority,
                estimatedTime,
                dueDate,
              });
            }}
            className=" m-auto px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Starta task!
          </button>
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

export default TodoItem;
