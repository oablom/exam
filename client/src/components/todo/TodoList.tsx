import React, { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { VITE_API_URL } from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchTodos = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/todos`, {
          credentials: "include",
        });
        const data = await res.json();
        setTodos(data);
      } catch {
        toast.error("Kunde inte hämta todos");
      }
    };

    fetchTodos();
  }, [user]);

  const handleAdd = async () => {
    if (!newTodo.trim()) return;

    try {
      const res = await fetch(`${VITE_API_URL}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: newTodo }),
      });

      const data = await res.json();
      setTodos((prev) => [...prev, data]);
      setNewTodo("");
    } catch {
      toast.error("Kunde inte lägga till todo");
    }
  };

  const handleToggle = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const res = await fetch(`${VITE_API_URL}/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed: !todo.completed, title: todo.title }),
      });

      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      toast.error("Kunde inte uppdatera todo");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${VITE_API_URL}/api/todos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      toast.error("Kunde inte ta bort todo");
    }
  };

  if (!user) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Logga in för att se dina todos.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Ny todo..."
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lägg till
        </button>
      </div>

      {!user ? (
        <p>Logga in för att se dina todos</p>
      ) : (
        todos.length === 0 && <p className="text-gray-500">Inga todos ännu.</p>
      )}

      <div className="flex flex-col gap-2 w-full items-center">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            title={todo.title}
            completed={todo.completed}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
