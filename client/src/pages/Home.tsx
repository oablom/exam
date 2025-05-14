import React, { useState } from "react";
import { useTodo } from "@/hooks/useTodo";
import TodoItem from "@/components/todo/TodoItem";

const Home = () => {
  const { todos } = useTodo();
  const [showAll, setShowAll] = useState(false);

  const focusTodos = todos
    .filter((todo) => todo.priority === 1 || isToday(todo.dueDate))
    .slice(0, 3);

  const otherTodos = todos.filter((todo) => !focusTodos.includes(todo));

  return (
    <main className="w-full max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      <h1 className="text-2xl font-hand text-center">🧠 My ToDo-list</h1>

      <section>
        <h2 className="text-lg font-bold mb-2">🔥 Todays Focus</h2>
        <div className="flex flex-col gap-3">
          {focusTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>

        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-4 text-blue-500 underline text-sm"
          >
            Show all todos
          </button>
        )}

        {showAll && (
          <>
            <h3 className="mt-6 text-sm font-semibold opacity-60">
              📦 All other tasks
            </h3>
            <div className="flex flex-col gap-2 opacity-60">
              {otherTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} small />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Home;

function isToday(dateString?: string): boolean {
  if (!dateString) return false;
  const today = new Date().toISOString().split("T")[0];
  return dateString.startsWith(today);
}
