import React from "react";
import { Todo } from "@/types";
import TodoItem from "../TodoItem";

interface FocusListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onFocus: (todo: Todo) => void;
  onSelectToggle: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onToggleFocus: (todo: Todo) => void;
  selectedIds: string[];
}

const FocusList: React.FC<FocusListProps> = ({
  todos,
  onEdit,
  onFocus,
  onSelectToggle,
  onDelete,
  onToggleFocus,
  selectedIds,
}) => {
  const focusTodos = todos.filter((t) => t.isFocus);
  if (focusTodos.length === 0) return null;

  return (
    <section className="mt-4 mb-6 px-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold text-zinc-800 dark:text-white mb-2">
        🎯 Fokus idag
      </h2>

      <div className="flex flex-col gap-3">
        {focusTodos.map((todo) => (
          <div key={todo.id} className="relative">
            <TodoItem
              todo={todo}
              isSelected={selectedIds.includes(todo.id)}
              onEdit={onEdit}
              onFocus={onFocus}
              onSelectToggle={onSelectToggle}
              onDelete={onDelete}
            />

            {/* knapp för att ta bort från fokus */}
            <button
              onClick={() => onToggleFocus(todo)}
              className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full
                         bg-yellow-100 hover:bg-yellow-200 text-yellow-800
                         border border-yellow-300"
            >
              Ta bort
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FocusList;
