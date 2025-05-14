import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, CheckCircle2, Clock, Calendar } from "lucide-react";
import { useTodoStore } from "@/store/todo";

interface NewTodoFormProps {
  setFormRef?: (ref: { submit: () => void }) => void;
  onClose?: () => void;
}

const NewTodoForm: React.FC<NewTodoFormProps> = ({ setFormRef, onClose }) => {
  const { addTodo } = useTodoStore();

  /* ---------- state ---------- */
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<1 | 2 | 3>(2);
  const [estimated, setEstimated] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>("");
  const [showPicker, setShowPicker] = useState(false);

  /* ---------- helpers ---------- */
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();

  const toggleDate = (date: string) =>
    setDueDate((prev) => (prev === date ? "" : date));

  /* ---------- submit ---------- */
  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      await addTodo({
        title,
        priority,
        estimatedTime: estimated || undefined,
        dueDate,
        completed: false,
      });

      // reset
      setTitle("");
      setEstimated(0);
      setDueDate("");
      setPriority(2);
      toast.success("Todo tillagd!");
      onClose?.();
    } catch (err: any) {
      toast.error(err.message || "Fel vid skapande");
    }
  };

  useEffect(() => {
    setFormRef?.({ submit: handleSubmit });
  }, [title, priority, estimated, dueDate]);

  /* ---------- UI ---------- */
  return (
    <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-gray-100">
      {/* header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Skapa Todo</h2>
        <button
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 transition hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* titel */}
      <div className="relative mb-6 space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Vad ska du göra?
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="T.ex. Deklarera"
          className="w-full rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-200
                     placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {title.trim() && (
          <CheckCircle2 className="absolute right-3 top-[51px] h-5 w-5 text-green-500" />
        )}
      </div>

      {/* prio */}
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium">Prio:</p>
        <div className="flex gap-3">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p as 1 | 2 | 3)}
              className={`
                h-7 w-7 rounded-full transition
                ${
                  p === 1
                    ? "bg-red-500"
                    : p === 2
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }
                ${priority === p ? "ring-2 ring-blue-600 ring-offset-2" : ""}
              `}
            />
          ))}
        </div>
      </div>

      {/* tid */}
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium">Tid:</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm">
            <Clock className="h-3.5 w-3.5" /> {estimated} min
          </span>

          {[5, 10].map((step) => (
            <button
              key={step}
              onClick={() => setEstimated((prev) => prev + step)}
              className="rounded-xl bg-gray-100 px-3 py-1 text-sm font-medium shadow-sm transition hover:bg-gray-200 active:scale-95"
            >
              + {step} m
            </button>
          ))}

          <button
            onClick={() => setEstimated(0)}
            className="rounded-xl bg-gray-100 px-3 py-1 text-sm shadow-sm transition hover:bg-gray-200 active:scale-95"
          >
            ⟲
          </button>
        </div>
      </div>

      {/* deadline */}
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium">Deadline:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleDate(today)}
            className={`flex items-center gap-1 rounded-xl px-4 py-1.5 text-sm shadow-sm transition active:scale-95
              ${
                dueDate === today
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            <Calendar className="h-3.5 w-3.5" /> Idag
          </button>

          <button
            onClick={() => toggleDate(tomorrow)}
            className={`rounded-xl px-4 py-1.5 text-sm shadow-sm transition active:scale-95
              ${
                dueDate === tomorrow
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            Imorgon
          </button>

          <button
            onClick={() => setShowPicker(true)}
            className="rounded-xl bg-gray-100 px-4 py-1.5 text-sm shadow-sm transition hover:bg-gray-200 active:scale-95"
          >
            Välj datum
          </button>
        </div>

        {showPicker && (
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-2 w-full rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* CTA */}
      <button
        onClick={handleSubmit}
        disabled={!title.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl
                   bg-gradient-to-b from-blue-600 to-blue-700 px-6 py-3
                   text-lg font-semibold text-white shadow-lg transition
                   active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <CheckCircle2 className="h-5 w-5" /> Lägg till
      </button>
    </div>
  );
};

export default NewTodoForm;
