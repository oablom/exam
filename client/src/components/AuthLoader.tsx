import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/store/auth";
import LoadingSpinner from "@/components/LoadingSpinner";

const AuthLoader = () => {
  const { setAuth, logout } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          { withCredentials: true }
        );
        setAuth(res.data);
      } catch {
        logout();
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (checking) {
    return <LoadingSpinner fullPage message="🔐 Logging in..." />;
  }

  return null;
};

export default AuthLoader;
