import { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "../layout/Button";
import { AppWindow } from "lucide-react";

const InstallPwatModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasSeenPrompt = localStorage.getItem("hasSeenInstallPrompt");
    if (!hasSeenPrompt) {
      setShowModal(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenInstallPrompt", "true");
    setShowModal(false);
  };

  const handleInstallClick = () => {
    handleClose();
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={handleClose}
      onSubmit={() => {}}
      actionLabel=""
      title="Installera appen"
      body={
        <div className="flex flex-col items-center gap-4 p-4">
          <p>Vill du installera denna app på din enhet för snabbare åtkomst?</p>
        </div>
      }
      footer={
        <div className="flex gap-2">
          <Button
            label="Installera"
            icon={<AppWindow className="mr-2" />}
            onClick={handleInstallClick}
          />
          <Button label="Senare" onClick={handleClose} outline />
        </div>
      }
    />
  );
};

export default InstallPwatModal;
