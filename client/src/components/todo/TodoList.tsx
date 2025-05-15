import { useState, useEffect } from "react";
import { Todo } from "@/types";
import TodoItem from "./TodoItem";
import Button from "@/components/Button";
import NewTodoModal from "./NewTodoModal";
import TodoActions from "./TodoActions";
import FocusModal from "../modals/FocusModal";
import { useTodoStore } from "@/store/todo";

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

  const isToday = (dateString?: string) => {
    if (!dateString) return false;
    const today = new Date().toISOString().split("T")[0];
    return dateString.startsWith(today);
  };

  const getSmartTodayTodos = () => {
    const todayTodos = todos.filter((t) => isToday(t.dueDate));
    if (todayTodos.length >= 4) return todayTodos;

    const others = todos
      .filter((t) => !isToday(t.dueDate))
      .sort((a, b) => {
        const dateA = new Date(a.dueDate || Infinity).getTime();
        const dateB = new Date(b.dueDate || Infinity).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return a.priority - b.priority;
      });

    return [...todayTodos, ...others.slice(0, 4 - todayTodos.length)];
  };

  const filteredTodos = showAll
    ? [...todos].sort((a, b) => {
        const dateA = new Date(a.dueDate || Infinity).getTime();
        const dateB = new Date(b.dueDate || Infinity).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return a.priority - b.priority;
      })
    : getSmartTodayTodos();

  const allIds = filteredTodos.map((todo) => todo.id);
  const isAllSelected = selectedTodoIds.length === allIds.length;

  const handleSelectAll = () => {
    setSelectedTodoIds(isAllSelected ? [] : allIds);
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

  const handleStartFocus = () => {
    const first = todos.find((t) => selectedTodoIds.includes(t.id));
    if (first) {
      setFocusTodo(first);
      setIsFocusOpen(true);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-center gap-2">
        <Button
          label={showAll ? "🔙 Visa dagens todos" : "📋 Visa alla todos"}
          onClick={() => setShowAll(!showAll)}
          outline
          small
        />
        {filteredTodos.length > 0 && (
          <Button
            label={isAllSelected ? "❌ Avmarkera alla" : "✔️ Markera alla"}
            onClick={handleSelectAll}
            outline
            small
          />
        )}
      </div>
      <TodoActions
        todos={todos}
        selectedIds={selectedTodoIds}
        onClear={() => setSelectedTodoIds([])}
        onDelete={handleDelete}
        onComplete={handleComplete}
      />
      <div className="flex flex-col gap-3">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className="relative"
            onClick={() =>
              setSelectedTodoIds((prev) =>
                prev.includes(todo.id)
                  ? prev.filter((id) => id !== todo.id)
                  : [...prev, todo.id]
              )
            }
          >
            <TodoItem
              todo={todo}
              isSelected={selectedTodoIds.includes(todo.id)}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          </div>
        ))}
      </div>

      <Button label="➕ Add Todo" onClick={() => setIsModalOpen(true)} />
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
    </section>
  );
};

export default TodoList;
