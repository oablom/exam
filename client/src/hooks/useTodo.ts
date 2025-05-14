import { useState } from "react";
import { Todo } from "@/types";

export const useTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      title: "Testa nya todo-haken!",
      completed: false,
      priority: 1,
      dueDate: "2025-05-14",
    },
    {
      id: "2",
      title: "Köp mjölk",
      completed: false,
      priority: 2,
    },
    {
      id: "3",
      title: "Träna",
      completed: true,
      priority: 3,
    },
  ]);

  const addTodo = (todo: Todo) => {
    setTodos((prev) => [...prev, todo]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return { todos, addTodo, toggleTodo, deleteTodo };
};
