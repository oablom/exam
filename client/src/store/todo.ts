import { create } from "zustand";
import { Todo } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

interface TodoState {
  todos: Todo[];
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, "id">) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],

  fetchTodos: async () => {
    try {
      const res = await fetch(`${API_URL}/api/todos`, {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      set({ todos: data });
    } catch (err) {
      console.error("fetchTodos error:", err);
    }
  },

  addTodo: async (todo) => {
    try {
      const res = await fetch(`${API_URL}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(todo),
      });
      if (!res.ok) return;
      const newTodo = await res.json();
      set({ todos: [...get().todos, newTodo] });
    } catch (err) {
      console.error("addTodo error:", err);
    }
  },

  updateTodo: async (id: string, updates: Partial<Todo>) => {
    try {
      const res = await fetch(`${API_URL}/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!res.ok) return;
      const updated = await res.json();
      set({
        todos: get().todos.map((t) => (t.id === id ? { ...t, ...updated } : t)),
      });
    } catch (err) {
      console.error("updateTodo error:", err);
    }
  },

  deleteTodo: async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/todos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) return;
      set({ todos: get().todos.filter((t) => t.id !== id) });
    } catch (err) {
      console.error("deleteTodo error:", err);
    }
  },

  toggleTodo: async (id) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;

    const updated = { ...todo, completed: !todo.completed };

    try {
      const res = await fetch(`${API_URL}/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updated),
      });
      if (!res.ok) return;
      set({
        todos: get().todos.map((t) => (t.id === id ? updated : t)),
      });
    } catch (err) {
      console.error("toggleTodo error:", err);
    }
  },
}));
