import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Todo } from "@/types";
import TodoItem from "./TodoItem";
import Button from "@/components/Button";
import TodoActions from "./TodoActions";
import FocusModal from "../modals/FocusModal";
import { useTodoStore } from "@/store/todo";
import TodoModal from "./TodoModal";
import { CalendarDays, CalendarRange } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

// ...imports
const TodoList = () => {
  const { todos, deleteTodo, toggleTodo, fetchTodos } = useTodoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<string[]>([]);
  const [focusTodo, setFocusTodo] = useState<Todo | null>(null);
  const [isFocusOpen, setIsFocusOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [modal, setModal] = useState<{
    mode: "new" | "edit";
    todo?: Todo;
  } | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSelectToggle = (id: string) => {
    setSelectedTodoIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async (ids: string[]) => {
    for (const id of ids) {
      await deleteTodo(id);
    }
    setSelectedTodoIds([]);
  };

  const handleComplete = async (ids: string[], complete: boolean) => {
    for (const id of ids) {
      const todo = todos.find((t) => t.id === id);
      if (!todo) continue;
      if (todo.completed !== complete) {
        await toggleTodo(id);
      }
    }
    setSelectedTodoIds([]);
  };

  const handleOpenFocus = (todo: Todo) => {
    setFocusTodo(todo);
    setIsFocusOpen(true);
  };

  const filteredTodos = showAll ? todos : getSmartTodayTodos();

  // ✅ Korrekt placering: UTANFÖR getSmartTodayTodos
  const handleToggleAll = () => {
    const allIds = filteredTodos.map((todo) => todo.id);
    if (selectedTodoIds.length === filteredTodos.length) {
      setSelectedTodoIds([]);
    } else {
      setSelectedTodoIds(allIds);
    }
  };

  const baseButton =
    "text-xs border-2 border-zinc-500 transition rounded-full px-2 py-1 active:scale-95 ";

  const activeStyle =
    "bg-indigo-600 text-white border-indigo-600 hover:opacity-80";
  const inactiveStyle = " text-gray-700 hover:bg-indigo-200";

  function getSmartTodayTodos(): Todo[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todays = todos.filter((todo) => {
      if (!todo.dueDate) return true;
      const due = new Date(todo.dueDate);
      due.setHours(0, 0, 0, 0);
      return due.getTime() === today.getTime();
    });

    const sorted = [...todays].sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return (a.estimatedTime ?? 0) - (b.estimatedTime ?? 0);
    });

    const result: Todo[] = [];
    let totalMinutes = 0;

    for (const t of sorted) {
      const est = t.estimatedTime ?? 0;
      if (result.length === 4) break;
      if (totalMinutes + est > 360) break;
      result.push(t);
      totalMinutes += est;
    }

    return result;
  }

  return (
    <>
      <section className="flex flex-col gap-4 w-full max-w-md px-4 pb-28 sm:pb-4">
        {/* Header */}
        <div className="text-center mt-6 mb-4">
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
            {showAll ? "Alla uppgifter" : "Fokus idag"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {format(new Date(), "EEEE d MMMM", { locale: sv })}
          </p>
        </div>

        {filteredTodos.length > 1 && (
          <div className="flex justify-between pr-2 -mt-2">
            <button
              onClick={handleToggleAll}
              className={`${baseButton} ${
                selectedTodoIds.length === filteredTodos.length
                  ? activeStyle
                  : inactiveStyle
              }`}
            >
              {selectedTodoIds.length === filteredTodos.length
                ? "Avmarkera alla"
                : "Markera alla"}
            </button>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <button
                  className={`${baseButton} ${
                    !showAll ? activeStyle : inactiveStyle
                  }`}
                  onClick={() => setShowAll(false)}
                >
                  <CalendarDays size={14} className="inline mr-1 -mt-0.5" />
                  Idag
                </button>

                <button
                  className={`${baseButton} ${
                    showAll ? activeStyle : inactiveStyle
                  }`}
                  onClick={() => setShowAll(true)}
                >
                  <CalendarRange size={14} className="inline mr-1 -mt-0.5" />
                  Alla
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Bulk actions */}
        {selectedTodoIds.length > 0 && (
          <TodoActions
            todos={todos}
            selectedIds={selectedTodoIds}
            onClear={() => setSelectedTodoIds([])}
            onDelete={handleDelete}
            onComplete={handleComplete}
          />
        )}

        {/* Todo items */}
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isSelected={selectedTodoIds.includes(todo.id)}
            onSelectToggle={handleSelectToggle}
            onDelete={handleDelete}
            onFocus={handleOpenFocus}
            onEdit={(t) => setModal({ mode: "edit", todo: t })}
          />
        ))}
      </section>

      {/* FAB för mobil */}
      <button
        aria-label="Lägg till todo"
        onClick={() => setModal({ mode: "new" })}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-16 h-16 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors sm:hidden"
      >
        <Plus size={32} className="mx-auto" />
      </button>

      {/* Add-knapp på desktop */}
      <div className="hidden sm:flex justify-center mt-4">
        <Button label="Add Todo" onClick={() => setModal({ mode: "new" })} />
      </div>

      {/* Modaler */}
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
