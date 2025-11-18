// import PropTypes from "prop-types";
import { ReactNode } from "react";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {title: "TaskHub", description: "Gestor de tareas"};

export default function RootLayout({children}: {children:ReactNode})  {
  return(
    <html lang="es">
    <body className="min-h-screen">
      <Navbar />
      <main>{children}</main>
    </body>
    </html>
  )
}