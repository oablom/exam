import { useEffect, useState } from "react";
import { VITE_API_URL } from "@/lib/api";
import { Todo } from "@/types";
import TodoItem from "./TodoItem";
import FilterBar from "./FilterBar";
import Button from "@/components/Button";
import NewTodoModal from "./NewTodoModal";

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<1 | 2 | 3 | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleAdd = (todo: Todo) => {
    setTodos((prev) => [...prev, todo]);
  };

  const handleToggle = (id: string, newValue: boolean) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: newValue } : todo
      )
    );
  };

  return (
    <div className="space-y-4">
      <FilterBar
        active={priorityFilter}
        onChange={(priority) =>
          setPriorityFilter(priority === priorityFilter ? null : priority)
        }
      />
      <div className="space-y-2">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={handleDelete}
            onToggle={handleToggle}
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
