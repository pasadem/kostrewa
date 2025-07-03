// fragment in _app.tsx
import "@/styles/globals.css";
import { AppProps } from "next/app";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);

    if (token) {
      fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((user) => setUserRole(user.role))
        .catch(() => setUserRole(null));
    }
  }, []);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    location.reload();
  };

  return (
    <>
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">
          Магазин
        </Link>
        <nav className="space-x-4">
          <Link href="/orders">Заказы</Link>

          <Link href="/cart">Корзина</Link>
          {token ? (
            <button onClick={logout} className="underline">
              Выход
            </button>
          ) : (
            <>
              <Link href="/login">Вход</Link>
              <Link href="/register">Регистрация</Link>
            </>
          )}
        </nav>
        <nav className="space-x-4">
          <Link href="/">Магазин</Link>
          <Link href="/cart">Корзина</Link>
          <Link href="/orders">Заказы</Link>
          {userRole === "ADMIN" && (
            <>
              <Link href="/admin/products">Админ: Товары</Link>
              <Link href="/admin/orders">Админ: Заказы</Link>
            </>
          )}
          {token ? (
            <button onClick={logout} className="underline">
              Выход
            </button>
          ) : (
            <>
              <Link href="/login">Вход</Link>
              <Link href="/register">Регистрация</Link>
            </>
          )}
        </nav>
      </header>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
