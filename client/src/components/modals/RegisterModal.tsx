import { useState } from "react";
import Modal from "./Modal";
import useRegisterModal from "@/hooks/useRegisterModal";
import axios from "axios";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/auth/register", formData);
      console.log("Registrerad:", response.data);
      registerModal.onClose();
    } catch (error) {
      console.error("Registreringsfel:", error);
    }
  };

  const body = (
    <div className="space-y-4">
      <input
        name="name"
        placeholder="Namn"
        className="w-full border p-2"
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        className="w-full border p-2"
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Lösenord"
        className="w-full border p-2"
        onChange={handleChange}
      />
    </div>
  );

  const footer = (
    <div className="pt-4 text-right">
      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Registrera
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={registerModal.isOpen}
      onClose={registerModal.onClose}
      onSubmit={handleSubmit}
      title="Skapa konto"
      actionLabel="Registrera"
      body={body}
      footer={footer}
    />
  );
};

export default RegisterModal;
