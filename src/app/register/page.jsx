"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import styles from "./page.module.css";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        "https://todo-seek-backend-production.up.railway.app/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("Error al registrar usuario");
      }

      const result = await res.json();

      Swal.fire({
        title: "Registro exitoso",
        text: `¡Bienvenido, ${result.user.email}!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/login");
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
        <h1 className={styles.title}>Crear Cuenta</h1>
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
            Registrarme
          </button>
          <p className={styles.loginText}>
            ¿Ya tienes una cuenta?
            <Link href="/login" className={styles.loginLink}>
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
