import { useNavigate } from "react-router-dom";
import { useTodo } from "@/hooks/useTodo";

interface Props {
  selectedIds: string[];
  onClear: () => void;
  onDelete: (ids: string[]) => void;
  onComplete: (ids: string[], value: boolean) => void;
}

const TodoActions: React.FC<Props> = ({
  selectedIds,
  onClear,
  onDelete,
  onComplete,
}) => {
  const navigate = useNavigate();
  const { todos } = useTodo();

  if (!selectedIds || selectedIds.length === 0) return null;

  const selectedTodos = todos.filter((todo) => selectedIds.includes(todo.id));
  const allAreCompleted = selectedTodos.every((todo) => todo.completed);
  const newValue = !allAreCompleted;

  return (
    <div className="flex flex-wrap gap-3 justify-center p-3 bg-zinc-100 dark:bg-zinc-700 rounded-2xl shadow-inner">
      <button
        onClick={() => onDelete(selectedIds)}
        className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
      >
        🗑 Radera ({selectedIds.length})
      </button>
      <button
        onClick={() => onComplete(selectedIds, newValue)}
        className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
      >
        ✅ Mark as {newValue ? "Completed" : "Uncompleted"}
      </button>
      <button
        onClick={() => {
          navigate("/focus", { state: { todos: selectedTodos } });
          onClear();
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
      >
        🎯 Focus Mode
      </button>
    </div>
  );
};

export default TodoActions;
