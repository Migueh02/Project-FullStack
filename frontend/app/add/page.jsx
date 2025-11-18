// Vista para agregar las tareas mediante un formulario
"use client";
import { useState } from "react";
import axios from "axios";

export default function AddTask() {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [loading, setLoading] = useState(false);

    // HandleSubmit que ayuda a enviar info al back
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!titulo.trim()) {
            alert("El título es requerido");
            return;
        }

        try {
            setLoading(true);
            await axios.post("http://localhost:4000/api/tasks", { titulo, descripcion });
            setTitulo("");
            setDescripcion("");
            alert("Tarea creada con éxito");
        } catch (error) {
            console.error("Error creando tarea:", error);
            alert("No se pudo crear la tarea. Revisa la consola o el backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Agregar nueva tarea</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
                <input
                    className="border p-2 rounded"
                    placeholder="Titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />

                <textarea
                    className="border p-2 rounded"
                    placeholder="Descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? "Guardando..." : "Guardar"}
                </button>
            </form>
        </div>
    );
}