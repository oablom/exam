import { useAuth } from "@/store/auth";
import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";

const Header = () => {
  const { user, logout } = useAuth();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  return (
    <header className="bg-white shadow-md dark:bg-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          TodoApp
        </h1>

        <nav className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-sky-500 transition">
            Hem
          </a>
          <a href="/about" className="hover:text-sky-500 transition">
            Om oss
          </a>
          <a href="/contact" className="hover:text-sky-500 transition">
            Kontakt
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logga ut
              </button>
            </>
          ) : (
            <>
              <button
                onClick={loginModal.onOpen}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Logga in
              </button>
              <button
                onClick={registerModal.onOpen}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Registrera
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
