"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { setCredentials } from "../../store/slices/authSlice";
import Link from "next/link";
import styles from "./page.module.css";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        "https://todo-seek-backend-production.up.railway.app/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("Credenciales inválidas");
      }

      const result = await res.json();
      dispatch(setCredentials({ token: result.token, user: result.user }));

      Swal.fire({
        title: "Inicio de sesión exitoso",
        text: `¡Bienvenido ${result.user.email}!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/todos");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div>
            <label className={styles.label}>Correo electrónico</label>
            <input
              type="email"
              className={styles.input}
              placeholder="Ingresa tu correo"
              {...register("email", { required: "El correo es obligatorio" })}
            />
            {errors.email && (
              <p className={styles.errorText}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className={styles.label}>Contraseña</label>
            <input
              type="password"
              className={styles.input}
              placeholder="******"
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
            />
            {errors.password && (
              <p className={styles.errorText}>{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className={styles.submitBtn}>
            Iniciar Sesión
          </button>
        </form>
        <p className={styles.registerText}>
          ¿No tienes cuenta?
          <Link href="/register" className={styles.registerLink}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
