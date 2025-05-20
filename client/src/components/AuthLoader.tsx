import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/store/auth";

const AuthLoader = () => {
  const { setAuth, setToken, logout, setLoading } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          withCredentials: true,
        });
        setAuth(res.data);
      } catch {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const res = await axios.get("/api/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setToken(token);
            setAuth(res.data);
            return;
          } catch {
            localStorage.removeItem("token");
          }
        }
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return null;
};

export default AuthLoader;
