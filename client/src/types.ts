import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { ChangeEvent } from "react";

// ✅ Centralized TypeScript interfaces

export interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  className?: string;
}

export interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  register?: UseFormRegister<FieldValues>;
  errors?: FieldErrors;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}
export interface TodoItemProps {
  todo: Todo;
  isSelected: boolean;
  onSelectToggle: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onFocus: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onToggleFocus?: (todo: Todo) => void;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3;
  estimatedTime?: number;
  dueDate?: string;
  isFocus?: boolean;
}

export interface TodoActionsProps {
  todos: Todo[];
  selectedIds: string[];
  onClear: () => void;
  onDelete: (ids: string[]) => void;
  onComplete: (ids: string[], newValue: boolean) => void;
  extraButton?: ExtraButtonProps;
  onAddToFocus: (ids: string[]) => void;
}

export interface ExtraButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface LoginModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export interface RegisterModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export interface User {
  id: string;
  name?: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  setAuth: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}
