import React, { useState } from "react";
import { CheckCircle, Circle, Pencil, Play } from "lucide-react";
import { TodoItemProps } from "@/types";
import Button from "@/components/Button";

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

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isSelected,
  onSelectToggle,
  onEdit,
  onFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { id, title, completed, priority, estimatedTime, dueDate } = todo;

  const priorityColor =
    priority === 1
      ? "border-red-500"
      : priority === 2
      ? "border-yellow-400"
      : "border-green-500";

  return (
    <div
      onClick={() => setIsOpen((p) => !p)}
      className={`flex flex-col gap-2 p-4 ${
        isOpen ? "py-4" : "py-2"
      } rounded-2xl shadow-md transition-all duration-200
        hover:cursor-pointer focus-visible:outline-none
        ${completed ? "opacity-50" : ""} 
        ${
          isSelected
            ? "ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/40"
            : "bg-white dark:bg-zinc-800"
        }
        border-l-4 ${priorityColor}`}
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
            <CheckCircle size={28} className="text-blue-500" />
          ) : (
            <Circle size={28} />
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

        {/* Actions – minimerat läge */}
        {!isOpen && (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(todo);
              }}
              className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-blue-100 transition "
              aria-label="Redigera"
            >
              <Pencil size={26} className="text-blue-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFocus(todo);
              }}
              className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-green-100 transition"
              aria-label="Starta"
            >
              <Play size={26} className="text-green-600" />
            </button>
          </div>
        )}
      </div>

      {/* Expanded */}
      {isOpen && (
        <>
          {/* Info badges */}
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
          </div>

          {/* Stora knappar längst ner */}
          <div
            className="flex gap-2 justify-center mt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              label="Starta"
              onClick={() => onFocus(todo)}
              className=" text-white font-medium  px-3 py-1.5 rounded-full shadow-sm border-none"
            />
            <Button
              label="Redigera"
              onClick={() => onEdit(todo)}
              outline
              className="bg-white hover:bg-zinc-100 text-zinc-800 font-medium  px-3 py-1.5 rounded-full shadow-sm border border-zinc-600"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
