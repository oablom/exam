import React, { useState, useEffect } from "react";
import {
  Plus,
  CalendarDays,
  CalendarClock,
  Target,
  ListTodo,
  CheckCircle,
  Circle,
} from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

import { Todo } from "@/types";
import TodoItem from "./TodoItem";
import TodoActions from "@/components/todo/TodoActions";
import TodoSection from "./TodoSection";
import FocusModal from "../modals/FocusModal";
import TodoModal from "./TodoModal";
import { useTodoStore } from "@/store/todo";
import Button from "@/components/layout/Button";

const TodoList: React.FC = () => {
  const { todos, deleteTodo, toggleTodo, updateTodo, fetchTodos } =
    useTodoStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [focusTodo, setFocusTodo] = useState<Todo | null>(null);
  const [isFocusOpen, setIsFocusOpen] = useState(false);
  const [view, setView] = useState<"today" | "prio" | "all">("today");
  const [modal, setModal] = useState<{
    mode: "new" | "edit";
    todo?: Todo;
  } | null>(null);

  const handleStartFocus = (todo: Todo) => {
    setFocusTodo(todo);
    setIsFocusOpen(true);
  };

  useEffect(() => {
    void fetchTodos();
  }, [fetchTodos]);

  const handleAddToFocus = async (ids: string[]) => {
    ids.forEach((id) => updateTodo(id, { isFocus: true }));
    setSelectedIds([]);
  };

  const handleToggleFocus = async (todo: Todo) => {
    updateTodo(todo.id, { isFocus: !todo.isFocus });
  };

  const handleSelectToggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleDelete = async (ids: string[]) => {
    await Promise.all(ids.map(deleteTodo));
    setSelectedIds([]);
  };

  const handleComplete = async (ids: string[], complete: boolean) => {
    await Promise.all(
      ids.map(async (id) => {
        const t = todos.find((x) => x.id === id);
        if (t && t.completed !== complete) await toggleTodo(id);
      })
    );
    setSelectedIds([]);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueToday = todos.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    const d = new Date(t.dueDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  const overdue = todos.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    const d = new Date(t.dueDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() < today.getTime();
  });

  const focusTodos = todos.filter((t) => t.isFocus);
  const completedTodos = todos.filter((t) => t.completed);

  const baseBtn =
    "text-xs border-2 border-zinc-500 rounded-full px-2 py-1 transition active:scale-95";
  const activeBtn =
    "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700";
  const inactiveBtn =
    "bg-white text-zinc-800 border-zinc-300 hover:bg-indigo-100";

  return (
    <>
      <section className="flex flex-col gap-4 w-full max-w-md px-4 pb-28 sm:pb-4">
        <div className="text-center mt-6 mb-4">
          <h1 className="text-2xl font-hand font-bold text-zinc-800 dark:text-white">
            {view === "today"
              ? "Dagens uppgifter"
              : view === "prio"
              ? "Prioriterade"
              : "Alla uppgifter"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {format(new Date(), "EEEE d MMMM", { locale: sv })}
          </p>
        </div>

        <div
          className={`flex ${
            todos.length > 0 ? "justify-between" : "justify-end"
          } items-center mb-2 px-2`}
        >
          {todos.length > 0 && (
            <button
              onClick={() =>
                setSelectedIds((prev) =>
                  prev.length === todos.length ? [] : todos.map((x) => x.id)
                )
              }
              className={`${baseBtn} ${
                selectedIds.length === todos.length ? activeBtn : inactiveBtn
              }`}
            >
              {selectedIds.length === todos.length
                ? "Avmarkera alla"
                : "Markera alla"}
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setView("today")}
              className={`${baseBtn} ${
                view === "today" ? activeBtn : inactiveBtn
              }`}
            >
              <CalendarDays size={14} className="inline mr-1 -mt-0.5" /> Idag
            </button>
            <button
              onClick={() => setView("prio")}
              className={`${baseBtn} ${
                view === "prio" ? activeBtn : inactiveBtn
              }`}
            >
              <Target size={14} className="inline mr-1 -mt-0.5" /> Prio
            </button>
            <button
              onClick={() => setView("all")}
              className={`${baseBtn} ${
                view === "all" ? activeBtn : inactiveBtn
              }`}
            >
              <ListTodo size={14} className="inline mr-1 -mt-0.5" /> Alla
            </button>
          </div>
        </div>

        <TodoActions
          todos={todos}
          selectedIds={selectedIds}
          onClear={() => setSelectedIds([])}
          onDelete={handleDelete}
          onComplete={handleComplete}
          onAddToFocus={handleAddToFocus}
        />

        {view === "today" && (
          <>
            <TodoSection
              title="⏰ Deadline i dag"
              todos={dueToday}
              selectedIds={selectedIds}
              onEdit={(t) => setModal({ mode: "edit", todo: t })}
              onFocus={handleStartFocus}
              onSelectToggle={handleSelectToggle}
              onDelete={handleDelete}
            />
            <TodoSection
              title="🚨 Försenade"
              todos={overdue}
              selectedIds={selectedIds}
              onEdit={(t) => setModal({ mode: "edit", todo: t })}
              onFocus={handleStartFocus}
              onSelectToggle={handleSelectToggle}
              onDelete={handleDelete}
            />
          </>
        )}

        {view === "prio" && (
          <TodoSection
            title="🎯 Priolista"
            todos={focusTodos}
            selectedIds={selectedIds}
            onEdit={(t) => setModal({ mode: "edit", todo: t })}
            onFocus={handleStartFocus}
            onSelectToggle={handleSelectToggle}
            onDelete={handleDelete}
            onToggleFocus={handleToggleFocus}
          />
        )}

        {view === "all" && (
          <TodoSection
            title="📋 Alla Todos"
            todos={todos}
            selectedIds={selectedIds}
            onEdit={(t) => setModal({ mode: "edit", todo: t })}
            onFocus={handleStartFocus}
            onSelectToggle={handleSelectToggle}
            onDelete={handleDelete}
          />
        )}

        {completedTodos.length > 0 && (
          <TodoSection
            title="✅ Klart"
            todos={completedTodos}
            selectedIds={selectedIds}
            onEdit={(t) => setModal({ mode: "edit", todo: t })}
            onComplete={handleComplete}
            onSelectToggle={handleSelectToggle}
          />
        )}
      </section>

      <button
        aria-label="Lägg till todo"
        onClick={() => setModal({ mode: "new" })}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-16 h-16 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors sm:hidden flex items-center justify-center"
      >
        <Plus size={36} />
      </button>

      <div className="hidden sm:flex justify-center mt-4">
        <Button
          label="Lägg till todo"
          onClick={() => setModal({ mode: "new" })}
        />
      </div>

      <TodoModal
        isOpen={!!modal}
        mode={modal?.mode as "new" | "edit"}
        todo={modal?.todo}
        onClose={() => setModal(null)}
      />

      <FocusModal
        todo={focusTodo}
        isOpen={isFocusOpen}
        onClose={() => setIsFocusOpen(false)}
        onComplete={(id) => {
          toggleTodo(id);
          setIsFocusOpen(false);
        }}
      />
    </>
  );
};

export default TodoList;
