import { useNavigate } from "react-router-dom";
import { TodoActionsProps } from "@/types";
import Button from "@/components/Button";
import { useEffect, useState } from "react";

const TodoActions: React.FC<TodoActionsProps> = ({
  selectedIds,
  todos,
  onClear,
  onDelete,
  onComplete,
}) => {
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (selectedIds.length > 0) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectedIds]);

  const selectedTodos = todos.filter((todo) => selectedIds.includes(todo.id));
  const allAreCompleted = selectedTodos.every((todo) => todo.completed);
  const newValue = !allAreCompleted;

  return (
    <div className="flex  justify- gap-5 px-2">
      <Button
        label={`🗑 Radera (${selectedIds.length})`}
        onClick={() => onDelete(selectedIds)}
        outline
        small
        className={` ${isSelected ? "opacity-100" : "opacity-50"}`}
      />
      <Button
        label={
          selectedIds.length === 0
            ? "✅ Klarmarkera"
            : allAreCompleted
            ? "↩ Ångra klarmarkering"
            : "✅ Klarmarkera"
        }
        onClick={() => onComplete(selectedIds, newValue)}
        outline
        small
        className={` ${isSelected ? "opacity-100" : "opacity-50"} `}
      />
      <Button
        label="🎯 Fokusläge"
        onClick={() => navigate("/focus", { state: { todos: selectedTodos } })}
        outline
        small
        className={` ${isSelected ? "opacity-100" : "opacity-50"}`}
      />
      {/* <Button label="❌ Avbryt" onClick={onClear} outline small /> */}
    </div>
  );
};

export default TodoActions;
