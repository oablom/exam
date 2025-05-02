interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  disabled,
  type = "text",
}) => {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      type={type}
      className="w-full p-2 border border-gray-300 rounded"
    />
  );
};

export default Input;
