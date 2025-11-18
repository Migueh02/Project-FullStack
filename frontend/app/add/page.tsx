// Vista para agregar las tareas mediante un formulario
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Categoria {
    id: number;
    nombre: string;
}

export default function AddTask() {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoriaId, setCategoriaId] = useState<number | null>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategorias, setLoadingCategorias] = useState(true);
    const router = useRouter();

    // Cargar categorías al montar el componente
    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        try {
            setLoadingCategorias(true);
            const response = await axios.get<Categoria[]>("http://localhost:4000/api/categorias");
            setCategorias(response.data);
        } catch (error) {
            console.error("Error cargando categorías:", error);
            alert("No se pudieron cargar las categorías");
        } finally {
            setLoadingCategorias(false);
        }
    };

    // Obtener usuarios_id del localStorage
    const getUsuarioId = () => {
        if (typeof window !== "undefined") {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                // Si no hay usuario logueado, redirigir al login
                router.push("/login");
                return null;
            }
            return parseInt(userId);
        }
        return null;
    };

    // HandleSubmit que ayuda a enviar info al back
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo.trim()) {
            alert("El título es requerido");
            return;
        }

        const usuarios_id = getUsuarioId();
        if (!usuarios_id) {
            alert("Debes iniciar sesión para crear tareas");
            router.push("/login");
            return;
        }

        const body: any = {
            titulo,
            descripcion: descripcion || null,
            usuarios_id
        };

        if (categoriaId) {
            body.categoria_id = categoriaId;
        }

        try {
            setLoading(true);
            await axios.post("http://localhost:4000/api/tasks", body);
            setTitulo("");
            setDescripcion("");
            setCategoriaId(null);
            alert("Tarea creada con éxito");
            router.push("/");
        } catch (error: any) {
            console.error("Error creando tarea:", error);
            const errorMessage = error.response?.data?.error || "No se pudo crear la tarea";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getColorCategoria = (nombreCategoria: string) => {
        const nombreLower = nombreCategoria.toLowerCase();
        if (nombreLower === "estudio") return "bg-yellow-200 border-yellow-400 text-yellow-900";
        if (nombreLower === "trabajo") return "bg-green-200 border-green-400 text-green-900";
        if (nombreLower === "hobby") return "bg-blue-200 border-blue-400 text-blue-900";
        return "bg-gray-200 border-gray-400 text-gray-900";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 animate-fade-in">
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold gradient-text mb-2">
                            ➕ Nueva Tarea
                        </h1>
                        <p className="text-gray-600">Crea una nueva tarea para organizar tu día</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Título <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="input-modern w-full"
                                placeholder="Ej: Estudiar React, Reunión con equipo..."
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                className="input-modern w-full resize-none"
                                placeholder="Agrega detalles sobre esta tarea..."
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                disabled={loading}
                                rows={5}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Categoría
                            </label>
                            {loadingCategorias ? (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                    <span className="text-sm">Cargando categorías...</span>
                                </div>
                            ) : (
                                <>
                                    <select
                                        className="input-modern w-full"
                                        value={categoriaId || ""}
                                        onChange={(e) => setCategoriaId(e.target.value ? parseInt(e.target.value) : null)}
                                        disabled={loading}
                                    >
                                        <option value="">Sin categoría</option>
                                        {categorias.map((categoria) => (
                                            <option key={categoria.id} value={categoria.id}>
                                                {categoria.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {categoriaId && (
                                        <div className="mt-3">
                                            {categorias
                                                .filter((c) => c.id === categoriaId)
                                                .map((categoria) => (
                                                    <span
                                                        key={categoria.id}
                                                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${getColorCategoria(categoria.nombre)}`}
                                                    >
                                                        📁 {categoria.nombre}
                                                    </span>
                                                ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="btn-primary flex-1 flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <span>✓</span>
                                        Guardar Tarea
                                    </>
                                )}
                            </button>
                            <Link
                                href="/"
                                className="btn-secondary flex items-center justify-center px-6"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
