import { render, screen, fireEvent } from "@testing-library/react";
import TodosPage from "../src/app/todos/page";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { store } from "../src/store/store";

describe("TodosPage", () => {
  const renderWithRedux = (component) => {
    return render(<Provider store={store}>{component}</Provider>);
  };

  test('muestra el título "Mis Tareas"', () => {
    renderWithRedux(<TodosPage />);
    expect(screen.getByText("Mis Tareas")).toBeInTheDocument();
  });

  test("renderiza formulario de creación", () => {
    renderWithRedux(<TodosPage />);
    expect(screen.getByText("Crear Nueva Tarea")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /agregar tarea/i })
    ).toBeInTheDocument();
  });
});
