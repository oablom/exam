import { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string, newValue: boolean) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onToggle }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("CHECKED:", e.target.checked);
    onToggle(todo.id, e.target.checked);
  };

  return (
    <div className="border p-4 rounded-md flex justify-between items-center gap-4">
      <div className="flex items-start gap-3 flex-1">
        <div className="flex-shrink-0 w-6 h-6">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => onToggle(todo.id, e.target.checked)}
            className="w-6 h-6 min-w-[1.5rem] min-h-[1.5rem] accent-green-600 cursor-pointer"
          />
        </div>
        <div className="flex-grow">
          <p
            className={`text-lg font-semibold break-words ${
              todo.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {todo.title}
          </p>
          <p className="text-sm text-gray-500">
            Prioritet: {todo.priority}{" "}
            {todo.estimatedTime && `| Tid: ${todo.estimatedTime} min`}{" "}
            {todo.dueDate && `| Deadline: ${todo.dueDate}`} |{" "}
            {todo.completed ? "✔️ Comppleted" : "⏳ Not completed"}
          </p>
        </div>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:underline"
      >
        Ta bort
      </button>
    </div>
  );
};

export default TodoItem;
