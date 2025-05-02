import { useCallback, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-hot-toast";

import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import Modal from "@/components/modals/Modal";

const LoginModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/auth/login", { email, password });
      toast.success("Du är nu inloggad!");
      loginModal.onClose();
    } catch (error: any) {
      toast.error("Fel vid inloggning");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <AiOutlineMail
          className="absolute top-3 left-3 text-gray-400"
          size={20}
        />
        <input
          disabled={isLoading}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="E-post"
          type="email"
          className="pl-10 p-2 border rounded-md w-full"
        />
      </div>
      <div className="relative">
        <RiLockPasswordLine
          className="absolute top-3 left-3 text-gray-400"
          size={20}
        />
        <input
          disabled={isLoading}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Lösenord"
          type="password"
          className="pl-10 p-2 border rounded-md w-full"
        />
      </div>
    </div>
  );

  const footerContent = (
    <div className="text-neutral-500 text-center mt-4">
      <p>
        Har du inget konto?
        <span
          onClick={onToggle}
          className="text-blue-500 cursor-pointer hover:underline ml-1"
        >
          Skapa ett konto
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Logga in"
      actionLabel="Fortsätt"
      onClose={loginModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
