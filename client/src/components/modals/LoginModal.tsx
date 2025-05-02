import axios from "axios";
import { useState } from "react";
import { useAuth } from "@/store/auth";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import Modal from "./Modal";
import Input from "../Input";
import Heading from "../Heading";
import toast from "react-hot-toast";

const LoginModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      setAuth(user, token);                     
      localStorage.setItem("token", token);     
      toast.success("Inloggad!");
      loginModal.onClose();                    
    } catch (error) {
      toast.error("Fel vid inloggning");
    } finally {
      setLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Välkommen tillbaka" subtitle="Logga in för att fortsätta" />
      <Input
        placeholder="Email"
        disabled={loading}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Lösenord"
        type="password"
        disabled={loading}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );

  const footerContent = (
    <div className="text-neutral-500 text-center mt-4">
      <p>
        Har inget konto?{" "}
        <span
          onClick={() => {
            loginModal.onClose();
            registerModal.onOpen();
          }}
          className="text-sky-500 cursor-pointer hover:underline"
        >
          Skapa konto
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      disabled={loading}
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
