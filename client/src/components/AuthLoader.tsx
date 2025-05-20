import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/store/auth";

const AuthLoader = () => {
  const { setAuth, setToken, logout, setLoading } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        setToken(token); // 🧠 Lagrar token i Zustand

        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/auth/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true, // om du även använder cookies
            }
          );
          setAuth(res.data);
        } catch {
          localStorage.removeItem("token");
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        logout(); // säkerställer att inget gammalt tillstånd lever kvar
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return null;
};

export default AuthLoader;
