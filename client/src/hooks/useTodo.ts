import { useEffect, useState } from "react";
import { Todo } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

export const useTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch(`${API_URL}/api/todos`, {
        credentials: "include",
      });
      const data = await res.json();
      setTodos(data);
    };
    fetchTodos();
  }, []);

  const addTodo = async (todo: Omit<Todo, "id">) => {
    const res = await fetch(`${API_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(todo),
    });
    const newTodo = await res.json();
    setTodos((prev) => [...prev, newTodo]);
  };

  const deleteTodo = async (id: string) => {
    const res = await fetch(`${API_URL}/api/todos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const msg = await res.text();
      console.error("❌ Delete failed:", msg);
      return;
    }

    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const updated = { ...todo, completed: !todo.completed };

    await fetch(`${API_URL}/api/todos/${id}`, {
      method: "PATCH", //
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updated),
    });

    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  return { todos, addTodo, deleteTodo, toggleTodo };
};
