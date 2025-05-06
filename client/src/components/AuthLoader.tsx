import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/store/auth";

const AuthLoader = () => {
  const { setAuth } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setAuth(res.data);
      } catch (err) {
        console.error("Not logged in", err);
      }
    };

    checkAuth();
  }, [setAuth]);

  return null;
};

export default AuthLoader;
