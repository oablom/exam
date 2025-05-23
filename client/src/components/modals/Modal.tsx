import { useEffect, useState, useCallback } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../layout/Button";
import { ModalProps } from "@/types";

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
    <div className="fixed inset-0 z-50 bg-neutral-800/70 flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div className="relative w-full min-h-dvh md:w-4/6 md:max-h-screen lg:w-3/6 xl:w-2/6 md:my-6 my-0 mx-auto overflow-y-auto">
        <div
          className={`
            translate duration-300 h-full
            ${
              showModal
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }
          `}
        >
          <div className="translate flex flex-col justify-between w-full min-h-dvh md:max-h-screen border-0 shadow-lg bg-white dark:bg-gray-700 outline-none focus:outline-none rounded-none md:rounded-lg overflow-y-auto">
            <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px] border-gray-200 dark:border-gray-600">
              <button
                onClick={handleOnClose}
                className="p-1 border-0 hover:opacity-70 transition absolute left-9 text-gray-500 dark:text-gray-300"
              >
                <IoMdClose size={18} />
              </button>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </div>
            </div>

            <div className="relative p-6 flex-auto text-gray-700 dark:text-gray-200">
              {body}
            </div>

            <div className="flex flex-col gap-2 p-6">
              <div className="flex flex-row items-center gap-4 w-full">
                {secondaryAction && secondaryActionLabel && (
                  <Button
                    disabled={disabled}
                    label={secondaryActionLabel}
                    onClick={handleSecondaryAction}
                  />
                )}
                {actionLabel?.trim() !== "" && (
                  <Button
                    disabled={disabled}
                    label={actionLabel}
                    onClick={handleSubmit}
                  />
                )}
              </div>

              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
