import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../src/app/login/page";
import "@testing-library/jest-dom";

describe("LoginPage", () => {
  test("renderiza campos de email y password", () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("Ingresa tu correo");
    const passwordInput = screen.getByPlaceholderText("******");
    const button = screen.getByRole("button", { name: /iniciar sesión/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test("muestra error si se hace submit sin llenar", async () => {
    render(<LoginPage />);

    const button = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(button);

    const errorEmail = await screen.findByText("El correo es obligatorio");
    expect(errorEmail).toBeInTheDocument();
  });
});
