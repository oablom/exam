import { useEffect, useState } from "react";
import { VITE_API_URL } from "@/lib/api";
import { Todo } from "@/types";
import TodoItem from "./TodoItem";
import Button from "@/components/Button";
import NewTodoModal from "./NewTodoModal";
import TodoActions from "./TodoActions";

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<1 | 2 | 3 | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch(`${VITE_API_URL}/api/todos`, {
        credentials: "include",
      });
      const data = await res.json();
      setTodos(data);
    };

    fetchTodos();
  }, []);

  const filteredTodos = priorityFilter
    ? todos.filter((todo) => todo.priority === priorityFilter)
    : todos;

  const handleDelete = (ids: string[]) => {
    setTodos((prev) => prev.filter((todo) => !ids.includes(todo.id)));
    setSelectedTodoIds([]);
  };

  const handleAdd = (todo: Todo) => {
    setTodos((prev) => [...prev, todo]);
  };

  const handleComplete = (ids: string[], newValue: boolean) => {
    setTodos((prev) =>
      prev.map((todo) =>
        ids.includes(todo.id) ? { ...todo, completed: newValue } : todo
      )
    );
    setSelectedTodoIds([]);
  };

  const toggleSelected = (id: string) => {
    setSelectedTodoIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearSelected = () => setSelectedTodoIds([]);

  return (
    <div className="space-y-4">
      <TodoActions
        todos={todos}
        selectedIds={selectedTodoIds}
        onDelete={handleDelete}
        onComplete={handleComplete}
        onClear={clearSelected}
      />

      <div className="space-y-2">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            title={todo.title}
            completed={todo.completed}
            onToggle={toggleSelected}
            onDelete={handleDelete}
            isSelected={selectedTodoIds.includes(todo.id)}
          />
        ))}
      </div>

      <NewTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
      />
      <Button label="Ny Todo" onClick={() => setIsModalOpen(true)} />
    </div>
  );
};

export default TodoList;
