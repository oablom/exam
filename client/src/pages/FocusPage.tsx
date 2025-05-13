import { useLocation, useNavigate } from "react-router-dom";
import { Todo } from "@/types";
import { useEffect } from "react";

const FocusPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const todos: Todo[] = location.state?.todos || [];

  useEffect(() => {
    if (!todos || todos.length === 0) {
      navigate("/");
    }
  }, [todos, navigate]);

  return (
    <div className="px-4 py-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">🎯 Fokusläge</h1>
      <p className="text-center text-zinc-500">
        Här är dina viktigaste uppgifter – jobba fokuserat!
      </p>

      {todos.slice(0, 4).map((todo) => (
        <div
          key={todo.id}
          className="p-4 rounded-2xl shadow bg-white dark:bg-zinc-800 space-y-2"
        >
          <h2 className="text-lg font-semibold">
            {todo.title} {todo.completed && "✅"}
          </h2>
          {todo.priority && (
            <div>
              Prioritet:{" "}
              {todo.priority === 1
                ? "🔴 Hög"
                : todo.priority === 2
                ? "🟡 Medel"
                : "🟢 Låg"}
            </div>
          )}
          {todo.estimatedTime && <div>Tid: {todo.estimatedTime} min</div>}
          {todo.dueDate && <div>Deadline: {todo.dueDate}</div>}
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
        >
          Tillbaka
        </button>
      </div>
    </div>
  );
};

export default FocusPage;
