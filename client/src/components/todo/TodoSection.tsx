import React from "react";
import { Todo } from "@/types";
import TodoItem from "./TodoItem";

interface TodoSectionProps {
  title: string;
  icon?: React.ReactNode;
  todos: Todo[];
  selectedIds?: string[];
  onEdit: (todo: Todo) => void;
  onFocus?: (todo: Todo) => void;
  onToggleFocus?: (todo: Todo) => void;
  onSelectToggle: (id: string) => void;
  onDelete?: (ids: string[]) => void;
  onComplete?: (ids: string[], complete: boolean) => void;
  justCompletedIds?: string[];
}

const TodoSection: React.FC<TodoSectionProps> = ({
  title,
  icon,
  todos,
  selectedIds = [],
  onEdit,
  onFocus,
  onToggleFocus,
  onSelectToggle,
  onDelete,
  onComplete,
  justCompletedIds = [],
}) => {
  if (todos.length === 0) return null;

  return (
    <section className="bg-white/60 dark:bg-zinc-800/40 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm overflow-hidden">
      <header className="flex items-center justify-center gap-3 px-4 pt-4 pb-2">
        {icon && (
          <span className="text-xl shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        <h2 className="text-lg  font-semibold text-zinc-800 dark:text-white">
          {title}
        </h2>
      </header>

      <div className="flex flex-col gap-3 p-4 pt-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isSelected={selectedIds.includes(todo.id)}
            onEdit={onEdit}
            onFocus={onFocus ?? (() => {})}
            onToggleFocus={onToggleFocus ?? (() => {})}
            onSelectToggle={onSelectToggle}
            onDelete={onDelete ?? (() => {})}
            onComplete={onComplete ?? (() => {})}
            justCompleted={justCompletedIds.includes(todo.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default TodoSection;
