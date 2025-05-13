import { useEffect, useState } from "react";
import { VITE_API_URL } from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";
import { Todo } from "@/types";
import Input from "@/components/Input";
import Heading from "@/components/Heading";
import Button from "@/components/Button";

interface NewTodoFormProps {
  onAdd: (todo: Todo) => void;
  setFormRef?: (ref: { submit: () => void }) => void;
}

const NewTodoForm: React.FC<NewTodoFormProps> = ({ onAdd, setFormRef }) => {
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
      if (!res.ok) throw new Error(data.message || "Något gick fel");

      onAdd(data);
      setTitle("");
      setEstimatedTime("");
      setDueDate("");
      setPriority(2);
      setShowAdvanced(false);
      toast.success("Todo tillagd!");
    } catch (err: any) {
      toast.error(err.message || "Fel vid skapande");
    }
  };

  useEffect(() => {
    setFormRef?.({ submit: handleSubmit });
  }, [title, priority, estimatedTime, dueDate]);

  return (
    <div className="space-y-4">
      <Heading title="Ny Todo" center />
      <Input
        id="title"
        label="Titel"
        placeholder="Vad behöver du göra?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex gap-2 justify-center">
        {[1, 2, 3].map((p) => (
          <Button
            key={p}
            label={p === 1 ? "🔴 High" : p === 2 ? "🟡 Medium" : "🟢 Low"}
            onClick={() => setPriority(p as 1 | 2 | 3)}
            outline={priority !== p}
            small
          />
        ))}
      </div>

      <div className="space-y-2">
        <Input
          id="estimatedTime"
          label="Tidsuppskattning"
          type="number"
          placeholder="Tidsuppskattning (minuter)"
          value={estimatedTime}
          onChange={(e) =>
            setEstimatedTime(
              e.target.value === "" ? "" : parseInt(e.target.value)
            )
          }
        />

        <Input
          id="dueDate"
          label="Deadline"
          type="date"
          placeholder="Deadline"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
    </div>
  );
};

export default NewTodoForm;
