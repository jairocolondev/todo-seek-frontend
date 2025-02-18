"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
import styles from "./page.module.css";

/**
 * @file page.jsx
 * @description Página principal donde se listan las tareas y se permite crearlas, editarlas, completarlas, etc.
 */

/**
 * Formatea una fecha a string legible
 * @param {string} dateString - fecha en formato ISO
 * @returns {string} fecha formateada localmente
 */
function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

/**
 * Página de Tareas
 * @component
 * @returns {JSX.Element} - Renderiza la lista de tareas y formulario de creación
 */

export default function TodosPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const { token } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm();

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Error al cargar tareas");
      }
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const onSubmitCreate = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: "pending",
        }),
      });
      if (!res.ok) {
        throw new Error("Error al crear la tarea");
      }
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      reset();
      Swal.fire("Creada", "Tarea creada correctamente", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Activar modo edición
  const handleEdit = (task) => {
    setEditMode(true);
    setTaskToEdit(task);

    resetEdit({
      title: task.title,
      description: task.description,
    });
  };

  // Guardo cambios de edición
  const onSubmitEdit = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/todos/${taskToEdit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
        }),
      });
      if (!res.ok) {
        throw new Error("Error al actualizar la tarea");
      }
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditMode(false);
      setTaskToEdit(null);
      Swal.fire("Actualizada", "Tarea editada con éxito", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Marcar como completada
  const handleComplete = async (task) => {
    try {
      const now = new Date().toISOString();
      const res = await fetch(`${API_BASE}/todos/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "completed",
          completedAt: now,
        }),
      });
      if (!res.ok) {
        throw new Error("Error al completar la tarea");
      }
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      Swal.fire("Completada", "La tarea ha sido completada", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Función para volver a 'pendiente'
  // const handleUncomplete = async (task) => {
  //   try {
  //     const res = await fetch(`${API_BASE}/todos/${task.id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         status: "pending",
  //         completedAt: null,
  //       }),
  //     });
  //     if (!res.ok) {
  //       throw new Error("Error al desmarcar la tarea");
  //     }
  //     const updated = await res.json();
  //     setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  //     Swal.fire({
  //       title: "Desmarcada",
  //       text: "La tarea volvió a estado pendiente",
  //       icon: "info",
  //       timer: 2000,
  //       showConfirmButton: false,
  //     });
  //   } catch (error) {
  //     Swal.fire("Error", error.message, "error");
  //   }
  // };

  // Eliminar tarea
  const handleDelete = async (taskId) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar tarea?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE}/todos/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Error al eliminar la tarea");
      }
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      Swal.fire("Eliminada", "La tarea se ha eliminado", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.createForm}>
        <h2>Crear Nueva Tarea</h2>
        <form onSubmit={handleSubmit(onSubmitCreate)}>
          <div className={styles.formGroup}>
            <label>Título</label>
            <input
              type="text"
              {...register("title", {
                required: "El título es obligatorio",
              })}
            />
            {errors.title && (
              <p className={styles.errorText}>{errors.title.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label>Descripción</label>
            <textarea
              rows="2"
              {...register("description", {
                required: "La descripción es obligatoria",
              })}
            />
            {errors.description && (
              <p className={styles.errorText}>{errors.description.message}</p>
            )}
          </div>
          <button type="submit" className={styles.btnPrimary}>
            Agregar Tarea
          </button>
        </form>
      </div>

      {/* Formulario de edición, sólo si editMode = true */}
      {editMode && (
        <div className={styles.editForm}>
          <h2>Editar Tarea</h2>
          <form onSubmit={handleSubmitEdit(onSubmitEdit)}>
            <div className={styles.formGroup}>
              <label>Título</label>
              <input
                type="text"
                {...registerEdit("title", {
                  required: "El título es obligatorio",
                })}
              />
              {editErrors.title && (
                <p className={styles.errorText}>{editErrors.title.message}</p>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Descripción</label>
              <textarea
                rows="2"
                {...registerEdit("description", {
                  required: "La descripción es obligatoria",
                })}
              />
              {editErrors.description && (
                <p className={styles.errorText}>
                  {editErrors.description.message}
                </p>
              )}
            </div>
            <div className={styles.editFormButtons}>
              <button type="submit" className={styles.btnPrimary}>
                Guardar
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => {
                  setEditMode(false);
                  setTaskToEdit(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de tareas */}
      {isLoading ? (
        <p className={styles.loadingTasksList}></p>
      ) : tasks.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "1.3rem" }}>
          Aún no tienes tareas...
        </p>
      ) : (
        <div className={styles.taskList}>
          <h1 className={styles.title}>Mis Tareas</h1>
          {tasks.map((task) => (
            <div
              key={task.id}
              className={
                task.status === "completed"
                  ? `${styles.taskItem} ${styles.completed}`
                  : styles.taskItem
              }
            >
              <div className={styles.taskHeader}>
                <h3>{task.title}</h3>
                <div className={styles.taskActions}>
                  {task.status !== "completed" && (
                    <>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(task)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.completedBtn}
                        onClick={() => handleComplete(task)}
                      >
                        Completar
                      </button>
                    </>
                  )}
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(task.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <p className={styles.description}>{task.description}</p>
              <p className={styles.dates}>
                <span>
                  <strong>Creada el:</strong> {formatDate(task.createdAt)}
                </span>
                {task.status === "completed" && (
                  <span>
                    <strong>Completada el:</strong>{" "}
                    {formatDate(task.completedAt || task.updatedAt)}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
