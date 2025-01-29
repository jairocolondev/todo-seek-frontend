"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { logout } from "../../../store/slices/authSlice";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";

/**
 * @component
 */
export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  let username = "";
  if (user && user.email) {
    username = user.email.split("@")[0];
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <img
          src="https://jairocolon.com/wp-content/uploads/2024/11/Logo-Jairo-Colon-Claro.png"
          alt="Logo"
          className={styles.logo}
        />
      </div>
      <div>
        <h2 className={styles.titleSite}>
          Todo <mark>Seek</mark>
        </h2>
      </div>
      <div className={styles.userSection}>
        {user ? (
          <>
            <span className={styles.greeting}>Hola {username}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link href="/login" className={styles.loginLink}>
            Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  );
}
