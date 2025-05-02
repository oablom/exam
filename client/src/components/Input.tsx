import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { ChangeEvent } from "react";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;

  required?: boolean;
  register?: UseFormRegister<FieldValues>;
  errors?: FieldErrors;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,

  required,
  register,
  errors = {},
  value,
  onChange,
}) => {
  return (
    <div className="w-full relative">
      <input
        id={id}
        disabled={disabled}
        {...(register ? register(id, { required }) : {})}
        value={value}
        onChange={onChange}
        placeholder=" "
        type={type}
        className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition
            disabled:opacity-70 disabled:cursor-not-allowed
            ${errors[id] ? "border-rose-500" : "border-neutral-300"}
            ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
          `}
      />
      <label
        htmlFor={id}
        className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0]
            left-4 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
            peer-focus:scale-75 peer-focus:-translate-y-3
            ${errors[id] ? "text-rose-500" : "text-zinc-400"}
          `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
