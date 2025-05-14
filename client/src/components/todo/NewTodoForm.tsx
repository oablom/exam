import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTodo } from "@/hooks/useTodo";
import Input from "@/components/Input";
import Heading from "@/components/Heading";
import Button from "@/components/Button";
import { useTodoStore } from "@/store/todo";

interface NewTodoFormProps {
  setFormRef?: (ref: { submit: () => void }) => void;
  onClose?: () => void;
}

const NewTodoForm: React.FC<NewTodoFormProps> = ({ setFormRef, onClose }) => {
  const { addTodo } = useTodo();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<1 | 2 | 3>(2);
  const [estimatedTime, setEstimatedTime] = useState<number | "">("");
  const [dueDate, setDueDate] = useState<string>("");

  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      await addTodo({
        title,
        priority,
        estimatedTime: estimatedTime === "" ? undefined : estimatedTime,
        dueDate,
        completed: false,
      });

      setTitle("");
      setEstimatedTime("");
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
