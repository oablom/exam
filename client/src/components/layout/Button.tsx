import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
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
  disabled:opacity-70
  disabled:cursor-not-allowed
  rounded-lg
  hover:opacity-80
  transition
  w-full
  ${
    outline
      ? "bg-white border-black text-black"
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
      {label}
    </button>
  );
};

export default Button;
