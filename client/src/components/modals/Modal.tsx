import { useEffect, useState, useCallback } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";

interface ModalProps {
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

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleOnClose = useCallback(() => {
    if (disabled) return;
    setShowModal(false);
    setTimeout(onClose, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) return;
    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) return;
    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-800/70 flex items-center justify-center">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={handleOnClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black"
        >
          <IoMdClose />
        </button>

        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        <div>{body}</div>

        <div className="flex justify-end gap-2 mt-6">
          {secondaryAction && secondaryActionLabel && (
            <Button
              disabled={disabled}
              label={secondaryActionLabel}
              onClick={handleSecondaryAction}
            />
          )}
          <Button
            disabled={disabled}
            label={actionLabel}
            onClick={handleSubmit}
          />
        </div>

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
