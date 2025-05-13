import React, { useState } from "react";
import Modal from "../modals/Modal";
import NewTodoForm from "./NewTodoForm";
import { Todo } from "@/types";

interface NewTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (todo: Todo) => void;
}

const NewTodoModal: React.FC<NewTodoModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
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
      body={
        <NewTodoForm
          onAdd={(todo) => {
            onAdd(todo);
            onClose();
          }}
          setFormRef={setFormRef}
        />
      }
    />
  );
};

export default NewTodoModal;
