// src/components/todo/lists/CompletedList.tsx
import React from "react";
import { Todo } from "@/types";
import TodoItem from "../TodoItem";

interface CompletedListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onComplete: (ids: string[], complete: boolean) => void;
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
}

const CompletedList: React.FC<CompletedListProps> = ({
  todos,
  onEdit,
  onComplete,
  selectedIds,
  onSelectToggle,
}) => {
  // Filtrera ut alla slutförda todos
  const completed = todos.filter((t) => t.completed);
  if (completed.length === 0) return null;

  return (
    <section className="mt-2">
      <h2 className="text-lg font-bold text-zinc-800 dark:text-white mb-2">
        ✅ Slutförda idag ({completed.length})
      </h2>
      <div className="flex flex-col gap-3">
        {completed.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isSelected={selectedIds.includes(todo.id)}
            onSelectToggle={onSelectToggle}
            onEdit={onEdit}
            onFocus={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>
      <button
        onClick={() =>
          onComplete(
            completed.map((t) => t.id),
            false
          )
        }
        className="mt-3 px-3 py-1 text-sm border-2 rounded-full bg-white text-zinc-800 border-zinc-300 hover:bg-zinc-100"
      >
        Ångra alla
      </button>
    </section>
  );
};

export default CompletedList;
