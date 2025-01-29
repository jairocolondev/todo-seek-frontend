import { render, screen, fireEvent } from "@testing-library/react";
import RegisterPage from "../src/app/register/page";
import "@testing-library/jest-dom";

describe("RegisterPage", () => {
  test("renderiza los campos de registro", () => {
    render(<RegisterPage />);
    expect(
      screen.getByPlaceholderText("Ingresa tu correo")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("******")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /registrarme/i })
    ).toBeInTheDocument();
  });

  test("muestra error al hacer submit sin llenar campos", async () => {
    render(<RegisterPage />);
    const submitBtn = screen.getByRole("button", { name: /registrarme/i });
    fireEvent.click(submitBtn);

    const errorMsg = await screen.findByText("El correo es obligatorio");
    expect(errorMsg).toBeInTheDocument();
  });
});
