import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import Button from "./layout/Button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      console.log("Appen installerades");
    } else {
      console.log("Användaren nekade installation");
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <div className="fixed top-4 right-6 p-4 bg-blue-600 text-white rounded-xl shadow-xl z-50">
      <Button
        label={"Installera appen"}
        icon={<Phone className="mr-2" />}
        onClick={handleInstallClick}
      />
    </div>
  );
};

export default InstallPrompt;
