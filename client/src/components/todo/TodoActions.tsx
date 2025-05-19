import { useNavigate } from "react-router-dom";
import { TodoActionsProps } from "@/types";
import Button from "@/components/layout/Button";
import { useEffect, useState } from "react";
import {
  Trash2,
  CheckCircle,
  ChevronLeft,
  Star,
  StarOff,
  ArrowBigLeft,
} from "lucide-react";
import { IoMdArrowBack, IoMdArrowRoundBack } from "react-icons/io";

const TodoActions: React.FC<TodoActionsProps> = ({
  selectedIds,
  todos,
  onClear,
  onDelete,
  onComplete,
  onAddToFocus,
}) => {
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(selectedIds.length > 0);
  }, [selectedIds]);

  if (selectedIds.length === 0) return null;

  const selectedTodos = todos.filter((todo) => selectedIds.includes(todo.id));
  const allAreCompleted = selectedTodos.every((todo) => todo.completed);
  const allAreFocus = selectedTodos.every(
    (todo) => todo.isFocus && !todo.completed
  );
  const newValue = !allAreCompleted;

  return (
    <div className="flex gap-5 px-2">
      <Button
        icon={<Trash2 size={16} stroke="#ef4444" />}
        label={`Radera (${selectedIds.length})`}
        onClick={() => onDelete(selectedIds)}
        outline
        small
        className={isSelected ? "opacity-100" : "opacity-50"}
      />
      <Button
        icon={
          allAreCompleted ? (
            <IoMdArrowRoundBack size={16} stroke="#6b7280" />
          ) : (
            <CheckCircle size={16} stroke="#10b981" />
          )
        }
        label={allAreCompleted ? "Ångra klarmarkering" : "Klarmarkera"}
        onClick={() => onComplete(selectedIds, newValue)}
        outline
        small
        className={isSelected ? "opacity-100" : "opacity-50"}
      />
      <Button
        icon={
          allAreFocus ? (
            <StarOff size={16} stroke="#4b5563" />
          ) : (
            <Star size={16} stroke="#fbbf24" />
          )
        }
        label={allAreFocus ? "Ta bort från fokus" : "Lägg till i fokus"}
        onClick={() => onAddToFocus(selectedIds)}
        outline
        small
        className={isSelected ? "opacity-100" : "opacity-50"}
      />
      {/* <Button icon={<X size={16} stroke="#ef4444" />} label="Avbryt" onClick={onClear} outline small /> */}
    </div>
  );
};

export default TodoActions;
