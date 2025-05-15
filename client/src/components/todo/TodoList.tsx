import { useState, useEffect } from "react";
import { Todo } from "@/types";
import TodoItem from "./TodoItem";
import Button from "@/components/Button";
import NewTodoModal from "./NewTodoModal";
import TodoActions from "./TodoActions";
import { useTodoStore } from "@/store/todo";

const TodoList = () => {
  const { todos, deleteTodo, toggleTodo, fetchTodos } = useTodoStore();
  const [priorityFilter, setPriorityFilter] = useState<1 | 2 | 3 | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<string[]>([]);

  const filteredTodos = priorityFilter
    ? todos.filter((todo) => todo.priority === priorityFilter)
    : todos;

  const allIds = filteredTodos.map((todo) => todo.id);
  const isAllSelected = selectedTodoIds.length === allIds.length;

  const handleSelectAll = () => {
    setSelectedTodoIds(isAllSelected ? [] : allIds);
  };

  const handleDelete = async (ids: string[]) => {
    console.log("🔁 Deleting todos:", ids);
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

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex gap-2 justify-center">
        {[1, 2, 3].map((p) => (
          <Button
            key={p}
            label={p === 1 ? "🔴 High" : p === 2 ? "🟡 Medium" : "🟢 Low"}
            onClick={() =>
              setPriorityFilter(priorityFilter === p ? null : (p as 1 | 2 | 3))
            }
            outline={priorityFilter !== p}
            small
          />
        ))}
      </div>
      <div className="flex justify-center">
        {todos.length > 0 && (
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
    </section>
  );
};

export default TodoList;
