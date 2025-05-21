import React, { useState, useEffect, useRef, use } from "react";
import {
  CheckCircle,
  Circle,
  Pencil,
  Play,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { TodoItemProps } from "@/types";
import Button from "@/components/layout/Button";
import { isOverdue, deadlineLabel, isDueToday } from "@/utils/dateHelpers";

import confetti from "canvas-confetti";
import { playCompletionBeep, playTimerEndBell } from "@/utils/audioHelper";

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const priorityLabel = (p: 1 | 2 | 3) =>
  p === 1 ? "Hög" : p === 2 ? "Mellan" : "Låg";

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isSelected,
  onSelectToggle,
  onEdit,
  onFocus,
  onToggleFocus,
  onDelete,
  onComplete,
  justCompleted,
}) => {
  const [open, setOpen] = useState(false);

  const { id, title, completed, priority, estimatedTime, dueDate } = todo;

  const overdue = isOverdue(dueDate, completed);
  const dueToday = isDueToday(dueDate);

  useEffect(() => {
    if (!justCompleted) return;

    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });

    playCompletionBeep();
  }, [justCompleted]);

  const priorityBorder =
    priority === 1
      ? "border-red-500"
      : priority === 2
      ? "border-orange-300"
      : "border-yellow-300";

  const base = `
    flex flex-col gap-2 p-4 rounded-2xl transition-all cursor-pointer
    hover:shadow-lg hover:scale-[1.01]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
    duration-500 ease-in-out
    border-l-[4px] border-b-[2px]
    ${priorityBorder}
    ${isSelected ? "ring-2 ring-indigo-400" : ""}
  `;

  let bg = "";
  if (completed) {
    bg =
      "!bg-green-50 hover:!bg-green-200 !border-green-700 dark:bg-green-900/40";
  } else if (overdue) {
    bg = "bg-red-200 hover:bg-red-300 dark:hover:bg-red-900/40";
  } else if (dueToday) {
    bg = "bg-red-50 hover:bg-red-100 dark:hover:bg-red-600/40";
  } else {
    bg = "bg-white dark:bg-zinc-800 hover:bg-indigo-50";
  }

  return (
    <div
      onClick={() => setOpen((p) => !p)}
      className={`
        ${base}
        ${bg}
        ${completed ? " opacity-60" : ""}
        ${
          justCompleted ? "animate-complete-pop animate-blink blur-[0.3px]" : ""
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectToggle(id);
          }}
          className="shrink-0 cursor-pointer"
        >
          {isSelected ? (
            <CheckCircle size={28} className="text-indigo-500" />
          ) : (
            <Circle size={28} />
          )}
        </div>

        <p
          className={`flex-1 mx-3 font-semibold text-lg truncate ${
            completed ? "opacity-60 line-through" : ""
          }`}
        >
          {title}
        </p>

        {!open && (
          <div className="flex items-center gap-2">
            {completed ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete([id]);
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-100"
                  aria-label="Radera"
                >
                  <Trash2 size={22} className="text-red-500" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete?.([id], false);
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-100"
                  aria-label="Ångra"
                >
                  <RotateCcw size={22} className="text-blue-500" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(todo);
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-indigo-100"
                  aria-label="Redigera"
                >
                  <Pencil size={22} className="text-indigo-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFocus(todo);
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-green-100"
                  aria-label="Starta"
                >
                  <Play size={22} className="text-green-600" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Expanded content */}
      {open && (
        <>
          <div className="flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-300 ml-8">
            <span>
              📌 <b>Prio:</b> {priorityLabel(priority)}
            </span>
            {estimatedTime !== undefined && (
              <span>
                ⏱️ <b>Tid:</b> {estimatedTime} min
              </span>
            )}
            {dueDate && (
              <span>
                📅 <b>Deadline:</b> {deadlineLabel(dueDate)}
              </span>
            )}
          </div>

          <div
            className="flex gap-2 justify-center mt-4"
            onClick={(e) => e.stopPropagation()}
          >
            {!completed && (
              <Button label="Starta" onClick={() => onFocus(todo)} />
            )}
            <Button
              outline
              label="Redigera"
              onClick={() => onEdit(todo)}
              className="border-zinc-600 "
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
