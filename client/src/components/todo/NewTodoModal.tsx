import React, { useState } from "react";
import Modal from "../modals/Modal";
import NewTodoForm from "./NewTodoForm";
import { Todo } from "@/types";

interface NewTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTodoModal: React.FC<NewTodoModalProps> = ({ isOpen, onClose }) => {
  const [formRef, setFormRef] = useState<{ submit: () => void } | null>(null);

  const handleSubmit = () => {
    formRef?.submit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      actionLabel="Lägg till"
      title="Ny Todo"
      body={<NewTodoForm setFormRef={setFormRef} onClose={onClose} />}
    />
  );
};

export default NewTodoModal;
