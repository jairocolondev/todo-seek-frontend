import "./globals.css";
import { Providers } from "./providers";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import { Rubik } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Todo Seek",
  description: "Sistema de Gestión de Tareas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={rubik.className}>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
