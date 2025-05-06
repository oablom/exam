import Modal from "./Modal";
import Heading from "../Heading";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

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
    <div className="flex flex-col gap-4">
      <Heading title={title} subtitle={message} center />
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
