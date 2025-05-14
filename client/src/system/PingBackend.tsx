import { useEffect } from "react";

const PingBackend = () => {
  useEffect(() => {
    const ping = () => {
      fetch("https://exam-92d2.onrender.com/api/ping", {
        credentials: "include",
      }).then(() => console.log("Ping backend"));
    };

    ping();
    const interval = setInterval(ping, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default PingBackend;
