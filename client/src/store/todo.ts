// ✅ Skapa fil: src/store/todo.ts
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
    const res = await fetch(`${API_URL}/api/todos`, {
      credentials: "include",
    });
    const data = await res.json();
    set({ todos: data });
  },

  addTodo: async (todo) => {
    const res = await fetch(`${API_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(todo),
    });
    const newTodo = await res.json();
    set({ todos: [...get().todos, newTodo] });
  },

  updateTodo: async (id: string, updates: Partial<Todo>) => {
    const res = await fetch(`${API_URL}/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    set({
      todos: get().todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    });
  },

  deleteTodo: async (id) => {
    await fetch(`${API_URL}/api/todos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    set({ todos: get().todos.filter((t) => t.id !== id) });
  },

  toggleTodo: async (id) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;
    const updated = { ...todo, completed: !todo.completed };

    await fetch(`${API_URL}/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updated),
    });

    set({
      todos: get().todos.map((t) => (t.id === id ? updated : t)),
    });
  },
}));
