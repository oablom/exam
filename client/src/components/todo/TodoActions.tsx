import { useNavigate } from "react-router-dom";
import { TodoActionsProps } from "@/types";
import Button from "@/components/layout/Button";
import { useEffect, useState } from "react";
import { Trash2, CheckCircle, Star, StarOff } from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";

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

  const buttonStyles = "flex flex-col border-[1.5px] border-indigo-400";

  const actionButtons = [
    {
      label: `Radera (${selectedIds.length})`,
      icon: <Trash2 size={16} stroke="#ef4444" />,
      onClick: () => onDelete(selectedIds),
      className: buttonStyles,
    },
    {
      label: allAreCompleted ? "Ångra klarmarkering" : "Klarmarkera",
      icon: allAreCompleted ? (
        <IoMdArrowRoundBack size={16} stroke="#6b7280" />
      ) : (
        <CheckCircle size={16} stroke="#10b981" />
      ),
      onClick: () => onComplete(selectedIds, newValue),
      className: buttonStyles,
    },
    {
      label: allAreFocus ? "Ta bort från fokus" : "Lägg till i fokus",
      icon: allAreFocus ? (
        <StarOff size={16} stroke="#4b5563" />
      ) : (
        <Star size={16} stroke="#fbbf24" />
      ),
      onClick: () => onAddToFocus(selectedIds),
      className: buttonStyles,
    },
  ];

  return (
    <div className="flex gap-5 px-2">
      {actionButtons.map((btn, index) => (
        <Button
          key={index}
          icon={btn.icon}
          label={btn.label}
          onClick={btn.onClick}
          outline
          small
          className={`${isSelected ? "opacity-100" : "opacity-50"} ${
            btn.className
          }`}
        />
      ))}
    </div>
  );
};

export default TodoActions;
