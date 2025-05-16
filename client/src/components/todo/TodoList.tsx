import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Todo } from "@/types";
import TodoItem from "./TodoItem";
import Button from "@/components/Button";
import NewTodoModal from "./NewTodoModal";
import TodoActions from "./TodoActions";
import FocusModal from "../modals/FocusModal";
import { useTodoStore } from "@/store/todo";

// ...imports
const TodoList = () => {
  const { todos, deleteTodo, toggleTodo, fetchTodos } = useTodoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<string[]>([]);
  const [focusTodo, setFocusTodo] = useState<Todo | null>(null);
  const [isFocusOpen, setIsFocusOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-hand">Mina Todos</h2>
          <div className="flex gap-2">
            <Button
              label="Idag"
              onClick={() => setShowAll(false)}
              small
              outline={showAll}
            />
            <Button
              label="Alla"
              onClick={() => setShowAll(true)}
              small
              outline={!showAll}
            />
          </div>
        </div>

        {filteredTodos.length > 1 && (
          <div className="flex justify-start pr-2 -mt-2">
            <button
              onClick={handleToggleAll}
              className="text-xs text-gray-700 border-2 p-[1px]   transition rounded-full px-2 py-1 bg-gray-100 hover:bg-gray-200 active:scale-95"
            >
              {selectedTodoIds.length === filteredTodos.length
                ? "Avmarkera alla"
                : "Markera alla"}
            </button>
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
          />
        ))}
      </section>

      {/* FAB för mobil */}
      <button
        aria-label="Lägg till todo"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors sm:hidden"
      >
        <Plus size={28} className="mx-auto" />
      </button>

      {/* Add-knapp på desktop */}
      <div className="hidden sm:flex justify-center mt-4">
        <Button label="➕ Add Todo" onClick={() => setIsModalOpen(true)} />
      </div>

      {/* Modaler */}
      <NewTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
