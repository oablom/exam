import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  CalendarDays,
  CalendarClock,
  Target,
  ListTodo,
  CheckCircle,
  Circle,
  AlarmClock,
  HandCoins,
  HandHelping,
  Bird,
  AlarmCheck,
  AlarmClockIcon,
  AlarmClockMinus,
} from "lucide-react";
import { format, set } from "date-fns";
import { sv } from "date-fns/locale";

import { Todo } from "@/types";
import TodoItem from "./TodoItem";
import TodoActions from "@/components/todo/TodoActions";
import TodoSection from "./TodoSection";
import FocusModal from "../modals/FocusModal";
import TodoModal from "./TodoModal";
import { useTodoStore } from "@/store/todo";
import Button from "@/components/layout/Button";
import { isDueToday, isOverdue } from "@/utils/dateHelpers";
import { matchesView, View } from "@/utils/viewHelpers";

const TodoList: React.FC = () => {
  const { todos, deleteTodo, toggleTodo, updateTodo, fetchTodos } =
    useTodoStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [focusTodo, setFocusTodo] = useState<Todo | null>(null);
  const [isFocusOpen, setIsFocusOpen] = useState(false);
  const [animatedIds, setAnimatedIds] = useState<string[]>([]);

  const [view, setView] = useState<"today" | "prio" | "all">("today");
  const [modal, setModal] = useState<{
    mode: "new" | "edit";
    todo?: Todo;
  } | null>(null);
  const todayKey = useMemo(() => new Date().toISOString().split("T")[0], []);
  const handleStartFocus = (todo: Todo) => {
    setFocusTodo(todo);
    setIsFocusOpen(true);
  };

  useEffect(() => {
    void fetchTodos();
  }, [fetchTodos]);

  const handleAddToFocus = async (ids: string[]) => {
    await Promise.all(ids.map((id) => updateTodo(id, { isFocus: true })));
    setSelectedIds([]);
  };

  const handleRemoveFromFocus = async (ids: string[]) => {
    await Promise.all(ids.map((id) => updateTodo(id, { isFocus: false })));
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
    for (const id of ids) {
      const t = todos.find((x) => x.id === id);
      if (t && t.completed !== complete) {
        await toggleTodo(id);

        if (complete) {
          // Vänta lite så att todo:n hinner flyttas till completedTodos
          setTimeout(() => {
            setAnimatedIds((prev) => [...prev, id]);
          }, 30); // <= detta ger React tid att flytta itemet
        }
      }
    }
    setSelectedIds([]);
  };

  useEffect(() => {
    setSelectedIds([]);
  }, [view]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueToday = todos.filter((t) => !t.completed && isDueToday(t.dueDate));
  const overdue = todos.filter((t) => !t.completed && isOverdue(t.dueDate));

  const focusTodos = todos.filter((t) => t.isFocus && !t.completed);
  const completedTodos = todos.filter((t) => t.completed);
  const activeTodos = todos.filter((t) => !t.completed);

  const visibleTodos =
    view === "today"
      ? [...dueToday, ...overdue, ...completedTodos]
      : view === "prio"
      ? focusTodos
      : [...activeTodos, ...completedTodos];

  const selectedTodos = todos.filter((t) => selectedIds.includes(t.id));
  const allSelectedAreFocus = selectedTodos.every((t) => t.isFocus);

  const baseBtn =
    "text-xs border-2 border-zinc-500 rounded-full px-2 py-1 transition active:scale-95";
  const activeBtn =
    "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700";
  const inactiveBtn =
    "bg-white text-zinc-800 border-zinc-300 hover:bg-indigo-100";

  return (
    <>
      <section className="flex flex-col gap-4 w-full max-w-md px-2 pb-28 sm:pb-4">
        <div className="text-center mt-6 mb-4">
          <h1 className="text-3xl font-hand font-bold text-zinc-800 dark:text-white">
            {view === "today"
              ? "🌞 Dagens uppgifter"
              : view === "prio"
              ? "🧘 Fokuslistan"
              : "📋 Alla uppgifter"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {format(new Date(), "EEEE d MMMM", { locale: sv })}
          </p>
        </div>
        <div
          className={`flex ${
            visibleTodos.length > 0 ? "justify-between" : "justify-end"
          } items-center mb-2 px-2`}
        >
          {visibleTodos.length > 0 && (
            <button
              onClick={() =>
                setSelectedIds((prev) =>
                  prev.length === visibleTodos.length
                    ? []
                    : visibleTodos.map((x) => x.id)
                )
              }
              className={`${baseBtn} ${
                selectedIds.length === visibleTodos.length
                  ? activeBtn
                  : inactiveBtn
              }`}
            >
              {selectedIds.length === visibleTodos.length
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
          onAddToFocus={
            view === "prio" && allSelectedAreFocus
              ? handleRemoveFromFocus
              : handleAddToFocus
          }
        />
        {view === "today" && (
          <>
            <TodoSection
              title="Deadline idag"
              icon={<AlarmClockMinus className="text-red-600" size={20} />}
              todos={dueToday}
              selectedIds={selectedIds}
              onEdit={(t) => setModal({ mode: "edit", todo: t })}
              onFocus={handleStartFocus}
              onSelectToggle={handleSelectToggle}
              onDelete={handleDelete}
            />
            {dueToday.length === 0 && overdue.length === 0 && (
              <div className="flex items-center text-center flex-col justify-center text-zinc-500 dark:text-zinc-400">
                <CalendarDays
                  size={42}
                  className="mr-2 text-indigo-400 dark:text-indigo-300"
                />
                <br />
                <span className="font-semibold ">
                  Inga todos med deadline idag. <br /> Kolla priolistan!
                </span>
              </div>
            )}
            <TodoSection
              title="Försenade"
              icon={<AlarmClock className="text-red-500" size={20} />}
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
            title="En åt gången"
            icon={<Bird className="text-indigo-500" size={20} />}
            todos={focusTodos}
            selectedIds={selectedIds}
            onEdit={(t) => setModal({ mode: "edit", todo: t })}
            onFocus={handleStartFocus}
            onSelectToggle={handleSelectToggle}
            onDelete={handleDelete}
            onToggleFocus={handleToggleFocus}
          />
        )}
        {focusTodos.length === 0 && view === "prio" && (
          <div className="flex items-center text-center flex-col justify-center text-zinc-500 dark:text-zinc-400">
            <Target
              size={42}
              className="mb-2 text-indigo-400 dark:text-indigo-300"
            />
            <span className="font-semibold ">
              Inga todos i priolistan. <br /> Lägg till genom att markera en
              todo och trycka på "Lägg till i fokus" knappen.
            </span>
          </div>
        )}
        {view === "all" && (
          <TodoSection
            title="🏃 Aktiva Todos"
            todos={activeTodos}
            selectedIds={selectedIds}
            onEdit={(t) => setModal({ mode: "edit", todo: t })}
            onFocus={handleStartFocus}
            onSelectToggle={handleSelectToggle}
            onDelete={handleDelete}
          />
        )}{" "}
        {activeTodos.length === 0 && view === "all" && (
          <div className="flex items-center text-center flex-col justify-center text-zinc-500 dark:text-zinc-400">
            <ListTodo
              size={42}
              className="mb-2 text-indigo-400 dark:text-indigo-300"
            />
            <span className="font-semibold ">
              Inga aktiva todos. <br /> Lägg till genom att trycka på knappen
              nedan.
            </span>
          </div>
        )}
        {completedTodos.length > 0 && view !== "prio" && (
          <TodoSection
            title=" Klart"
            icon={<CheckCircle className="text-green-500" size={20} />}
            todos={completedTodos}
            selectedIds={selectedIds}
            onDelete={handleDelete}
            onEdit={(t) => setModal({ mode: "edit", todo: t })}
            onComplete={handleComplete}
            onSelectToggle={handleSelectToggle}
            justCompleted={animatedIds}
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

      <div
        className="
    hidden sm:flex              
    fixed bottom-5 left-1/2      
    -translate-x-1/2 z-50
    w-80                      
  "
      >
        <Button
          label="Lägg till todo"
          onClick={() => setModal({ mode: "new" })}
        />
      </div>

      <TodoModal
        isOpen={!!modal}
        mode={modal?.mode as "new" | "edit"}
        todo={modal?.todo}
        onAdd={(dueDate) => {
          if (view !== "all" && !matchesView(view as View, dueDate, todayKey)) {
            setView("all");
          }
        }}
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
