import { useState } from "react";
import { VITE_API_URL } from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";
import { Todo } from "@/types";
import Button from "@/components/Button";

const NewTodoForm = ({ onAdd }: { onAdd: (todo: Todo) => void }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<1 | 2 | 3>(2);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number | "">("");
  const [dueDate, setDueDate] = useState<string>("");

  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      const res = await fetch(`${VITE_API_URL}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, priority, estimatedTime, dueDate }),
      });
      const data = await res.json();
      onAdd(data);
      setTitle("");
      setEstimatedTime("");
      setDueDate("");
    } catch {
      toast.error("Failed to add todo");
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg border border-gray-200 space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          className="flex-grow px-3 py-2 text-base rounded-md border border-gray-500 focus:outline-none focus:ring-2  focus:ring-blue-400"
        />
      </div>

      <div className="flex justify-center gap-2 flex-col">
        <p className="text-gray-600 ">Priority</p>
        <div className="flex justify-center gap-2">
          {([1, 2, 3] as const).map((p) => (
            <Button
              key={p}
              label={p === 1 ? "🔴 High" : p === 2 ? "🟡 Medium" : "🟢 Low"}
              onClick={() => setPriority(p)}
              outline={priority !== p}
              small
              className="border-gray-500"
            />
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-500 underline hover:text-blue-700"
        >
          {showAdvanced ? "Hide time options" : "Show time options"}
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Estimated Time (minutes)
            </label>
            <input
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Due Date</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      )}
      <Button label="Add" onClick={handleSubmit} />
    </div>
  );
};

export default NewTodoForm;
