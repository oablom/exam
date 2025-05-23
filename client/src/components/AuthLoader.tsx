import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/store/auth";

const AuthLoader = () => {
  const { setAuth, logout } = useAuth();

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
      }
    };

    checkAuth();
  }, [setAuth, logout]);

  return null;
};

export default AuthLoader;
