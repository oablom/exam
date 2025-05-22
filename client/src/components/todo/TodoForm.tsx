import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  X,
  CheckCircle2,
  Clock,
  Calendar,
  Tag,
  AlertTriangle,
  Circle,
} from "lucide-react";

import { useTodoStore } from "@/store/todo";
import { TodoFormProps } from "@/types";

const PRESETS = [5, 10, 20] as const;

const TodoForm: React.FC<TodoFormProps> = ({ mode, todo, onClose, onAdd }) => {
  const { addTodo, updateTodo } = useTodoStore();
  const isEdit = mode === "edit";

  const [title, setTitle] = useState(isEdit ? todo!.title : "");
  const [priority, setPriority] = useState<1 | 2 | 3>(
    isEdit ? (todo!.priority as 1 | 2 | 3) : 2
  );
  const [estimated, setEstimated] = useState<number>(
    isEdit ? todo!.estimatedTime ?? 0 : 20
  );
  const [dueDate, setDueDate] = useState<string>(
    isEdit && todo!.dueDate ? todo!.dueDate.split("T")[0] : ""
  );
  const [showPicker, setShowPicker] = useState(false);
  const [showCustomTime, setShowCustomTime] = useState(false);

  const today = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }, []);
  const todayKey = today.toISOString().split("T")[0];
  const tomorrowKey = tomorrow.toISOString().split("T")[0];
  const fmt = (d: Date) =>
    d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });

  const isPreset = PRESETS.includes(estimated as (typeof PRESETS)[number]);
  const hasEstimate = estimated > 0;

  const handleSubmit = async () => {
    if (!title.trim()) return;
    try {
      if (isEdit) {
        await updateTodo(todo!.id, {
          title,
          priority,
          estimatedTime: estimated || undefined,
          dueDate: dueDate || undefined,
        });

        toast.success("Todo uppdaterad!");
      } else {
        await addTodo({
          title,
          priority,
          estimatedTime: estimated || undefined,
          dueDate,
          completed: false,
        });
        toast.success("Todo tillagd!");
        onAdd?.(dueDate);
      }
      onClose?.();
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Något gick fel");
    }
  };

  return (
    <div className="font-lexend w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-gray-100">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-semibold">
          {isEdit ? "Redigera Todo" : "Ny Todo"}
        </h2>
        <button
          aria-label="Stäng"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative mb-8 space-y-2">
        <label htmlFor="title" className="text-base font-medium">
          Vad ska du göra?
        </label>
        <input
          id="title"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="T.ex. Deklarera"
          className="w-full rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {title.trim() && (
          <CheckCircle2 className="absolute right-3 top-[36px] h-5 w-5 text-green-500" />
        )}
      </div>

      <div className="mb-8 space-y-3">
        <p className="text-base font-medium">Prioritet:</p>
        <div className="grid grid-cols-3 gap-3 ">
          {[
            {
              level: 1,
              text: "Hög",
              icon: <AlertTriangle className="h-4 w-4" />,
              bg: "bg-red-500",
            },
            {
              level: 2,
              text: "Medel",
              icon: <Tag className="h-4 w-4" />,
              bg: "bg-orange-400",
            },
            {
              level: 3,
              text: "Låg",
              icon: <Circle className="h-4 w-4" />,
              bg: "bg-yellow-300",
            },
          ].map(({ level, text, icon, bg }) => (
            <button
              key={level}
              onClick={() => setPriority(level as 1 | 2 | 3)}
              className={`flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium shadow-sm transition active:scale-95 text-gray-800  ${bg} ${
                priority === level ? "ring-2 ring-indigo-600 ring-offset-2" : ""
              }`}
            >
              {icon}
              {text}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 space-y-3">
        <p className="text-base font-medium">Tid (est.):</p>
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => setEstimated((prev) => (prev === m ? 0 : m))}
              className={`flex items-center gap-1 rounded-xl px-4 py-1.5 text-sm shadow-sm transition active:scale-95 ${
                estimated === m
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Clock className="h-3.5 w-3.5" /> {m} min
            </button>
          ))}

          <button
            onClick={() => setShowCustomTime(!showCustomTime)}
            className={`rounded-xl px-4 py-1.5 text-sm shadow-sm transition active:scale-95 ${
              !isPreset && hasEstimate
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {!isPreset && hasEstimate ? `${estimated} min` : "Anpassa…"}
          </button>
        </div>
        {showCustomTime && (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={estimated || ""}
              onChange={(e) => setEstimated(parseFloat(e.target.value) || 0)}
              placeholder="minuter"
              className="w-24 rounded-xl bg-gray-50 px-3 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => setShowCustomTime(false)}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm active:scale-95"
            >
              OK
            </button>
          </div>
        )}
      </div>

      <div className="mb-10 space-y-3">
        <p className="text-base font-medium">Deadline:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDueDate(dueDate === todayKey ? "" : todayKey)}
            className={`flex items-center gap-1 rounded-xl px-4 py-1.5 text-sm shadow-sm active:scale-95 ${
              dueDate === todayKey
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" /> Idag {fmt(today)}
          </button>
          <button
            onClick={() =>
              setDueDate(dueDate === tomorrowKey ? "" : tomorrowKey)
            }
            className={`rounded-xl px-4 py-1.5 text-sm shadow-sm active:scale-95 ${
              dueDate === tomorrowKey
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            I morgon {fmt(tomorrow)}
          </button>
          <button
            onClick={() => setShowPicker(true)}
            className="rounded-xl bg-gray-100 px-4 py-1.5 text-sm shadow-sm hover:bg-gray-200 active:scale-95"
          >
            Välj datum
          </button>
        </div>
        {showPicker && (
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-3 w-full rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500"
          />
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!title.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-indigo-600 to-indigo-700 px-6 py-3 text-lg font-semibold text-white shadow-lg transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <CheckCircle2 className="h-5 w-5" /> {isEdit ? "Spara" : "Skapa"}
      </button>
    </div>
  );
};

export default TodoForm;
