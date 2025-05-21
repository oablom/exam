import Modal from "./Modal";
import Heading from "../Heading";
import { ConfirmModalProps } from "@/types";

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Är du säker?",
  message = "Denna åtgärd kan inte ångras.",
  confirmLabel = "Ta bort",
  cancelLabel = "Avbryt",
  loading = false,
}) => {
  const bodyContent = (
    <div className="flex flex-col gap-4 text-[18px]">
      <Heading title={title} center />
      <p className="text-zinc-600 text-center px-4">{message}</p>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onConfirm}
      actionLabel={confirmLabel}
      disabled={loading}
      secondaryAction={onClose}
      secondaryActionLabel={cancelLabel}
      body={bodyContent}
    />
  );
};

export default ConfirmModal;
