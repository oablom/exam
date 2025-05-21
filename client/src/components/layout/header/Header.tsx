import { useAuth } from "@/store/auth";
import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";
import Button from "@/components/layout/Button";
import WelcomeLabel from "./WelcomeLabel";
import { Menu } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { VITE_API_URL } from "@/lib/api";

const Header = () => {
  const { user, logout } = useAuth();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {}
    logout();
  };

  const hamburgerButtonStyle =
    "block w-full text-left px-4 py-2 text-sm text-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700";

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 shadow-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Vänster: Titel */}
        <h1 className="text-2xl font-bold font-hand text-gray-800 dark:text-white">
          ZenBuddy
        </h1>

        {/* Höger: Auth / Hamburger */}
        <div className="relative flex items-center gap-3">
          {user ? (
            <>
              <WelcomeLabel name={user.name} compact />
              <Button label="Logga ut" onClick={handleLogout} />
            </>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden sm:flex gap-3">
                <Button label="Logga in" onClick={loginModal.onOpen} />
                <Button
                  label="Registrera"
                  onClick={registerModal.onOpen}
                  outline
                  className="border-2 border-zinc-500 text-zinc-800 hover:bg-indigo-500 hover:text-white hover:border-indigo-500"
                />
              </div>

              {/* Mobile menu button */}
              <div className="sm:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Meny"
                >
                  <Menu size={24} className="text-zinc-800 dark:text-white" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-12 mt-2 w-40 rounded-lg shadow-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 py-2 z-50">
                    <button
                      onClick={() => {
                        loginModal.onOpen();
                        setMenuOpen(false);
                      }}
                      className={hamburgerButtonStyle}
                    >
                      Logga in
                    </button>
                    <button
                      onClick={() => {
                        registerModal.onOpen();
                        setMenuOpen(false);
                      }}
                      className={hamburgerButtonStyle}
                    >
                      Registrera
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
