"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// Definimos la estructura del tipo de dato que esperamos
interface Task {
    id: number;
    titulo: string;
    descripcion: string;
    categoria_id?: number | null;
    categoria_nombre?: string | null;
    usuarios_id?: number;
    estado?: boolean;
}

interface Categoria {
    id: number;
    nombre: string;
}

export default function Home() {
    // useState -> con el tipo Task[]
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitulo, setEditTitulo] = useState("");
    const [editDescripcion, setEditDescripcion] = useState("");
    const [editCategoriaId, setEditCategoriaId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Obtener usuarios_id del localStorage
    const getUsuarioId = () => {
        if (typeof window !== "undefined") {
            const userId = localStorage.getItem("userId");
            return userId ? parseInt(userId) : null;
        }
        return null;
    };

    // Cargar tareas y categorías
    useEffect(() => {
        cargarDatos();
    }, [categoriaFiltro]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const usuarios_id = getUsuarioId();

            if (!usuarios_id) {
                // Si no hay usuario logueado, no cargar tareas
                setTasks([]);
                setCategorias([]);
                return;
            }

            // Cargar categorías
            const categoriasResponse = await axios.get<Categoria[]>("http://localhost:4000/api/categorias");
            setCategorias(categoriasResponse.data);

            // Cargar tareas con filtros
            let url = `http://localhost:4000/api/tasks?usuario_id=${usuarios_id}`;
            if (categoriaFiltro) {
                url += `&categoria_id=${categoriaFiltro}`;
            }

            const tasksResponse = await axios.get<Task[]>(url);
            setTasks(tasksResponse.data);
        } catch (error) {
            console.error("Error cargando datos:", error);
            alert("No se pudieron cargar las tareas");
        } finally {
            setLoading(false);
        }
    };

    const iniciarEdicion = (tarea: Task) => {
        setEditingId(tarea.id);
        setEditTitulo(tarea.titulo);
        setEditDescripcion(tarea.descripcion || "");
        setEditCategoriaId(tarea.categoria_id || null);
    };

    const cancelarEdicion = () => {
        setEditingId(null);
        setEditTitulo("");
        setEditDescripcion("");
        setEditCategoriaId(null);
    };

    const handleActualizar = async (id: number) => {
        if (!editTitulo.trim()) {
            alert("El título es requerido");
            return;
        }

        try {
            setLoading(true);
            const body: any = {
                titulo: editTitulo.trim(),
                descripcion: editDescripcion.trim() || null
            };

            if (editCategoriaId) {
                body.categoria_id = editCategoriaId;
            } else {
                body.categoria_id = null;
            }

            await axios.put(`http://localhost:4000/api/tasks/${id}`, body);
            alert("Tarea actualizada con éxito");
            setEditingId(null);
            setEditTitulo("");
            setEditDescripcion("");
            setEditCategoriaId(null);
            cargarDatos();
        } catch (error: any) {
            console.error("Error actualizando tarea:", error);
            const errorMessage = error.response?.data?.error || "No se pudo actualizar la tarea";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
            return;
        }

        try {
            setDeletingId(id);
            await axios.delete(`http://localhost:4000/api/tasks/${id}`);
            alert("Tarea eliminada con éxito");
            cargarDatos();
        } catch (error: any) {
            console.error("Error eliminando tarea:", error);
            const errorMessage = error.response?.data?.error || "No se pudo eliminar la tarea";
            alert(errorMessage);
        } finally {
            setDeletingId(null);
        }
    };

    const getColorCategoria = (nombreCategoria: string | null | undefined) => {
        if (!nombreCategoria) return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 text-gray-800";
        const nombreLower = nombreCategoria.toLowerCase();
        if (nombreLower === "estudio") return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 text-yellow-900";
        if (nombreLower === "trabajo") return "bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-green-900";
        if (nombreLower === "hobby") return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 text-blue-900";
        return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 text-gray-800";
    };

    const getBadgeColor = (nombreCategoria: string | null | undefined) => {
        if (!nombreCategoria) return "bg-gray-200 border-gray-400 text-gray-800";
        const nombreLower = nombreCategoria.toLowerCase();
        if (nombreLower === "estudio") return "bg-yellow-200 border-yellow-400 text-yellow-900";
        if (nombreLower === "trabajo") return "bg-green-200 border-green-400 text-green-900";
        if (nombreLower === "hobby") return "bg-blue-200 border-blue-400 text-blue-900";
        return "bg-gray-200 border-gray-400 text-gray-800";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                                📋 Mis Tareas
                            </h1>
                            <p className="text-gray-600 text-lg">Gestiona todas tus tareas en un solo lugar</p>
                        </div>
                        <a
                            href="/add"
                            className="btn-primary flex items-center gap-2 whitespace-nowrap"
                        >
                            <span className="text-xl">+</span>
                            Nueva Tarea
                        </a>
                    </div>

                    {/* Filtro por categoría */}
                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-gray-100">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span>🔍</span>
                            Filtrar por categoría
                        </label>
                        <select
                            className="input-modern w-full max-w-xs"
                            value={categoriaFiltro || ""}
                            onChange={(e) => setCategoriaFiltro(e.target.value ? parseInt(e.target.value) : null)}
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Listado de tareas */}
                {loading && !editingId ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg font-medium">Cargando tareas...</p>
                        </div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-xl border border-gray-100 text-center animate-fade-in">
                        <div className="text-7xl mb-6">📝</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">No hay tareas disponibles</h3>
                        {getUsuarioId() ? (
                            <a href="/add" className="inline-block mt-4 btn-primary">
                                Crear tu primera tarea →
                            </a>
                        ) : (
                            <div className="mt-6">
                                <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tus tareas</p>
                                <a href="/login" className="btn-primary inline-block">
                                    Iniciar Sesión
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((t) => (
                            <div
                                key={t.id}
                                className={`p-6 border-2 rounded-2xl card-shadow bg-white hover-lift animate-fade-in ${
                                    t.categoria_nombre
                                        ? getColorCategoria(t.categoria_nombre)
                                        : "border-gray-200"
                                }`}
                            >
                                {editingId === t.id ? (
                                    <div className="space-y-4 animate-fade-in">
                                        <input
                                            type="text"
                                            className="input-modern w-full"
                                            placeholder="Título"
                                            value={editTitulo}
                                            onChange={(e) => setEditTitulo(e.target.value)}
                                            disabled={loading}
                                        />
                                        <textarea
                                            className="input-modern w-full resize-none"
                                            placeholder="Descripción"
                                            value={editDescripcion}
                                            onChange={(e) => setEditDescripcion(e.target.value)}
                                            disabled={loading}
                                            rows={3}
                                        />
                                        <select
                                            className="input-modern w-full"
                                            value={editCategoriaId || ""}
                                            onChange={(e) => setEditCategoriaId(e.target.value ? parseInt(e.target.value) : null)}
                                            disabled={loading}
                                        >
                                            <option value="">Sin categoría</option>
                                            {categorias.map((categoria) => (
                                                <option key={categoria.id} value={categoria.id}>
                                                    {categoria.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => handleActualizar(t.id)}
                                                disabled={loading}
                                                className="btn-success flex-1"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                        Guardando...
                                                    </span>
                                                ) : (
                                                    "✓ Guardar"
                                                )}
                                            </button>
                                            <button
                                                onClick={cancelarEdicion}
                                                disabled={loading}
                                                className="btn-secondary flex-1"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1 pr-2">
                                                <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight">{t.titulo}</h3>
                                                {t.descripcion && (
                                                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{t.descripcion}</p>
                                                )}
                                            </div>
                                            {t.categoria_nombre && (
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border-2 whitespace-nowrap ${getBadgeColor(t.categoria_nombre)}`}
                                                >
                                                    {t.categoria_nombre}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-5 pt-4 border-t border-gray-200 flex gap-2">
                                            <button
                                                onClick={() => iniciarEdicion(t)}
                                                className="btn-primary flex-1 text-sm py-2"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(t.id)}
                                                disabled={deletingId === t.id}
                                                className="btn-danger flex-1 text-sm py-2 disabled:opacity-50"
                                            >
                                                {deletingId === t.id ? (
                                                    <span className="flex items-center justify-center gap-1">
                                                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                                                        Eliminando...
                                                    </span>
                                                ) : (
                                                    "🗑️ Eliminar"
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
