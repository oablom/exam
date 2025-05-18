// src/components/todo/TodoList.tsx
import React, { useState, useEffect } from "react";
import { Plus, CalendarDays, CalendarRange } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

import { Todo } from "@/types";
import TodoItem from "./TodoItem";
import TodoActions from "@/components/todo/TodoActions";
import DeadlineTodayList from "./lists/DeadlineTodayList";
import FocusList from "./lists/FocusList";
import CompletedList from "./lists/CompletedList";
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
  const [showAll, setShowAll] = useState(false);
  const [modal, setModal] = useState<{
    mode: "new" | "edit";
    todo?: Todo;
  } | null>(null);

  /* ------------------------------------------------------------------ */
  /* Lifecycles                                                         */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  /* ------------------------------------------------------------------ */
  /* Handlers                                                           */
  /* ------------------------------------------------------------------ */

  const handleOpenFocus = (todo: Todo) => {
    setFocusTodo(todo);
    setIsFocusOpen(true);
  };

  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async (ids: string[]) => {
    await Promise.all(ids.map((id) => deleteTodo(id)));
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

  //  🔑 Uppdaterar state genom fetch efter varje patch
  const handleAddToFocus = async (ids: string[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Promise.all(
      ids.map(async (id) => {
        const t = todos.find((x) => x.id === id);
        if (t && !t.isFocus) {
          await updateTodo(id, {
            isFocus: true,
            dueDate: today.toISOString(),
          });
        }
      })
    );

    await fetchTodos(); // ← lägg till
    setSelectedIds([]);
  };

  const handleToggleFocus = async (todo: Todo) => {
    await updateTodo(todo.id, { isFocus: !todo.isFocus });
    await fetchTodos(); // ← valfritt; ger direkt visuellt svar
  };

  /* ------------------------------------------------------------------ */
  /* Derived data                                                       */
  /* ------------------------------------------------------------------ */

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueToday = todos.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    const d = new Date(t.dueDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  const focusTodos = todos.filter((t) => t.isFocus);
  const completedTodos = todos.filter((t) => t.completed);

  const remainingTodos = showAll
    ? todos
    : todos.filter(
        (t) =>
          !dueToday.some((dt) => dt.id === t.id) &&
          !focusTodos.some((ft) => ft.id === t.id) &&
          !completedTodos.some((ct) => ct.id === t.id)
      );

  /* ------------------------------------------------------------------ */
  /* Button style helpers                                               */
  /* ------------------------------------------------------------------ */

  const baseBtn =
    "text-xs border-2 border-zinc-500 rounded-full px-2 py-1 transition active:scale-95";
  const activeBtn =
    "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700";
  const inactiveBtn =
    "bg-white text-zinc-800 border-zinc-300 hover:bg-zinc-100";

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <>
      <section className="flex flex-col gap-4 w-full max-w-md px-4 pb-28 sm:pb-4">
        {/* Header ----------------------------------------------------- */}
        <div className="text-center mt-6 mb-4">
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
            {showAll ? "Alla uppgifter" : "Dagens fokus"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {format(new Date(), "EEEE d MMMM", { locale: sv })}
          </p>
        </div>

        {/* Vy-väljare -------------------------------------------------- */}
        <div className="flex justify-between items-center mb-2 px-2">
          <button
            onClick={() =>
              setSelectedIds((prev) =>
                prev.length === remainingTodos.length
                  ? []
                  : remainingTodos.map((x) => x.id)
              )
            }
            className={`${baseBtn} ${
              selectedIds.length === remainingTodos.length
                ? activeBtn
                : inactiveBtn
            }`}
          >
            {selectedIds.length === remainingTodos.length
              ? "Avmarkera alla"
              : "Markera alla"}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setShowAll(false)}
              className={`${baseBtn} ${!showAll ? activeBtn : inactiveBtn}`}
            >
              <CalendarDays size={14} className="inline mr-1 -mt-0.5" /> Idag
            </button>

            <button
              onClick={() => setShowAll(true)}
              className={`${baseBtn} ${showAll ? activeBtn : inactiveBtn}`}
            >
              <CalendarRange size={14} className="inline mr-1 -mt-0.5" /> Alla
            </button>
          </div>
        </div>

        {/* Bulk-actions ---------------------------------------------- */}
        <TodoActions
          todos={todos}
          selectedIds={selectedIds}
          onClear={() => setSelectedIds([])}
          onDelete={handleDelete}
          onComplete={handleComplete}
          onAddToFocus={handleAddToFocus}
        />

        {/* 1) Deadline i dag ------------------------------------------ */}
        {dueToday.length > 0 && (
          <DeadlineTodayList
            todos={todos}
            onEdit={(t) => setModal({ mode: "edit", todo: t })}
            onFocus={handleOpenFocus}
            onSelectToggle={handleSelectToggle}
            onDelete={handleDelete}
            selectedIds={selectedIds}
          />
        )}

        {/* 2) Fokus i dag --------------------------------------------- */}
        {focusTodos.length > 0 && (
          <FocusList
            todos={todos}
            onEdit={(t) => setModal({ mode: "edit", todo: t })}
            onFocus={handleOpenFocus}
            onSelectToggle={handleSelectToggle}
            onDelete={handleDelete}
            onToggleFocus={handleToggleFocus}
            selectedIds={selectedIds}
          />
        )}

        {/* 3) Slutförda ---------------------------------------------- */}
        {completedTodos.length > 0 && (
          <CompletedList
            todos={todos}
            onEdit={(t) => setModal({ mode: "edit", todo: t })}
            onComplete={handleComplete}
            onSelectToggle={handleSelectToggle}
            selectedIds={selectedIds}
          />
        )}

        {/* 4) Övriga uppgifter ---------------------------------------- */}
        {remainingTodos.length > 0 && (
          <section className="mt-4 px-2">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-white mb-2">
              {showAll ? "Alla uppgifter" : "Övriga uppgifter"}
            </h2>

            <div className="flex flex-col gap-3">
              {remainingTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isSelected={selectedIds.includes(todo.id)}
                  onSelectToggle={handleSelectToggle}
                  onDelete={handleDelete}
                  onFocus={handleOpenFocus}
                  onEdit={(t) => setModal({ mode: "edit", todo: t })}
                />
              ))}
            </div>
          </section>
        )}
      </section>

      {/* Lägg till-knapp (mobil) -------------------------------------- */}
      <button
        aria-label="Lägg till todo"
        onClick={() => setModal({ mode: "new" })}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-16 h-16 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors sm:hidden"
      >
        <Plus size={32} />
      </button>

      {/* Lägg till-knapp (desktop) ------------------------------------ */}
      <div className="hidden sm:flex justify-center mt-4">
        <Button
          label="Lägg till todo"
          onClick={() => setModal({ mode: "new" })}
        />
      </div>

      {/* Modaler ------------------------------------------------------ */}
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
