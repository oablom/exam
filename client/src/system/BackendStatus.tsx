import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface BackendStatusProps {
  message?: string;
}

const BackendStatus = ({ message }: BackendStatusProps) => {
  const [isOnline, setIsOnline] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState(false);

  useEffect(() => {
    const ping = async () => {
      try {
        const res = await fetch("https://exam-92d2.onrender.com/api/ping");
        if (res.ok) {
          setIsOnline(true);
        }
      } catch {
        setIsOnline(false);
      }
    };

    ping();

    const interval = setInterval(ping, 5000);
    const fallbackTimeout = setTimeout(() => setFallbackMessage(true), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  if (!isOnline) return null;

  return (
    <div className=" fixed inset-0 z-[1000] bg-zinc-500 bg-opacity-20 flex flex-col items-center justify-center h-screen text-center px-4 ">
      <LoadingSpinner message={message} />
      {fallbackMessage && (
        <p className="text-sm text-zinc-900 mt-2 max-w-sm">
          <span className="font-bold">
            This might take 15 seconds or more. Please be patient.
          </span>
          <br /> <br />
          The server is hosted via a third party and may take some time to
          respond. If the issue persists, please try refreshing the page or
          check back later. Thank you for your understanding!
        </p>
      )}
    </div>
  );
};

export default BackendStatus;
