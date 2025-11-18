// import PropTypes from "prop-types";
import { ReactNode } from "react";
import "./globals.css";

export const metadata = {tiltle: "TaskHub", description: "Gestor de tareas"};

export default function RootLayout({children}: {children:ReactNode})  {
  return(
    <html lang="es">
    <body className="bg-gray-100 text-gray-900">
      <nav className="bg-blue-600 text-wihte p-4 flex justify-between">
        <h1 className="font-bold text-xl">TaskHub</h1>
        <div>
          <a href="/" className="mx-2">Inicio</a>
          <a href="/add" className="mx-2 hover:underline">Nueva Tarea</a>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </body>
    </html>
  )
}