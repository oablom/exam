import React, { ReactNode } from "react";

interface ButtonProps {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  label,
  onClick,
  disabled,
  outline,
  small,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative
        flex items-center justify-center gap-2
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:bg-indigo-700
        transition
        w-full
        ${
          outline
            ? "bg-white border-black text-black hover:bg-indigo-200"
            : "bg-indigo-500 border-indigo-500 text-white"
        }
        ${
          small
            ? "py-[6px] px-3 text-sm font-medium border border-blue-300"
            : "py-2.5 px-4 text-base font-semibold border-2"
        }
        ${className ?? ""}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default Button;
