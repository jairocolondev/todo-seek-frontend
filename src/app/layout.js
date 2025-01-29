import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Todo Seek Frontend",
  description: "Sistema de Gestión de Tareas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
