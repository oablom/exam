import React from "react";
import { Todo } from "@/types";
import TodoItem from "./TodoItem";

interface TodoSectionProps {
  title: string;
  todos: Todo[];
  selectedIds?: string[];
  onEdit: (todo: Todo) => void;
  onFocus?: (todo: Todo) => void;
  onComplete?: (ids: string[], complete: boolean) => void;
  onToggleFocus?: (todo: Todo) => void;
  onSelectToggle: (id: string) => void;
  onDelete?: (ids: string[]) => void;
}

const TodoSection: React.FC<TodoSectionProps> = ({
  title,
  todos,
  selectedIds = [],
  onEdit,
  onFocus,
  onComplete,
  onToggleFocus,
  onSelectToggle,
  onDelete,
}) => {
  return (
    <section className="mt-4 ">
      <h2 className="text-lg font-bold text-zinc-800 dark:text-white mb-2">
        {title}
      </h2>

      <div className="flex flex-col gap-3">
        {todos.map((todo) => (
          <div key={todo.id} className="relative">
            <TodoItem
              todo={todo}
              isSelected={selectedIds.includes(todo.id)}
              onEdit={onEdit}
              onSelectToggle={onSelectToggle}
              onFocus={onFocus ?? (() => {})}
              onDelete={onDelete ?? (() => {})}
            />

            {/* {onToggleFocus && (
              <button
                onClick={() => onToggleFocus(todo)}
                className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full hover:bg-indigo-200 text-indigo-800 border border-indigo-300"
              >
                Ta bort från fokus
              </button>
            )} */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TodoSection;
