import React from "react";
import { Todo } from "@/types";
import TodoItem from "../TodoItem";

interface DeadlineTodayListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onFocus: (todo: Todo) => void;
  onSelectToggle: (id: string) => void;
  onDelete: (ids: string[]) => void;
  selectedIds: string[];
}

const DeadlineTodayList: React.FC<DeadlineTodayListProps> = ({
  todos,
  onEdit,
  onFocus,
  onSelectToggle,
  onDelete,
  selectedIds,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueToday = todos.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    const d = new Date(t.dueDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  if (dueToday.length === 0) return null;

  return (
    <section className="mt-2">
      <h2 className="text-lg font-bold text-zinc-800 dark:text-white mb-2">
        📅 Deadline idag
      </h2>
      <div className="flex flex-col gap-3">
        {dueToday.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isSelected={selectedIds.includes(todo.id)}
            onEdit={onEdit}
            onFocus={onFocus}
            onSelectToggle={onSelectToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};

export default DeadlineTodayList;
