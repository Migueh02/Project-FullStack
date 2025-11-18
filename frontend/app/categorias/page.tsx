// Vista para gestionar categorías (CRUD completo)
"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface Categoria {
    id: number;
    nombre: string;
}

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [nombre, setNombre] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editNombre, setEditNombre] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingList, setLoadingList] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Cargar categorías al montar el componente
    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        try {
            setLoadingList(true);
            const response = await axios.get<Categoria[]>("http://localhost:4000/api/categorias");
            setCategorias(response.data);
        } catch (error) {
            console.error("Error cargando categorías:", error);
            alert("No se pudieron cargar las categorías");
        } finally {
            setLoadingList(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) {
            alert("El nombre de la categoría es requerido");
            return;
        }

        try {
            setLoading(true);
            await axios.post("http://localhost:4000/api/categorias", { nombre: nombre.trim() });
            setNombre("");
            alert("Categoría creada con éxito");
            cargarCategorias();
        } catch (error: any) {
            console.error("Error creando categoría:", error);
            const errorMessage = error.response?.data?.error || "No se pudo crear la categoría";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const iniciarEdicion = (categoria: Categoria) => {
        setEditingId(categoria.id);
        setEditNombre(categoria.nombre);
    };

    const cancelarEdicion = () => {
        setEditingId(null);
        setEditNombre("");
    };

    const handleActualizar = async (id: number) => {
        if (!editNombre.trim()) {
            alert("El nombre de la categoría es requerido");
            return;
        }

        try {
            setLoading(true);
            await axios.put(`http://localhost:4000/api/categorias/${id}`, { nombre: editNombre.trim() });
            alert("Categoría actualizada con éxito");
            setEditingId(null);
            setEditNombre("");
            cargarCategorias();
        } catch (error: any) {
            console.error("Error actualizando categoría:", error);
            const errorMessage = error.response?.data?.error || "No se pudo actualizar la categoría";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
            return;
        }

        try {
            setDeletingId(id);
            await axios.delete(`http://localhost:4000/api/categorias/${id}`);
            alert("Categoría eliminada con éxito");
            cargarCategorias();
        } catch (error: any) {
            console.error("Error eliminando categoría:", error);
            const errorMessage = error.response?.data?.error || "No se pudo eliminar la categoría";
            alert(errorMessage);
        } finally {
            setDeletingId(null);
        }
    };

    const getColorCategoria = (nombreCategoria: string) => {
        const nombreLower = nombreCategoria.toLowerCase();
        if (nombreLower === "estudio") return "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 text-yellow-900";
        if (nombreLower === "trabajo") return "bg-gradient-to-br from-green-100 to-green-200 border-green-400 text-green-900";
        if (nombreLower === "hobby") return "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400 text-blue-900";
        return "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400 text-gray-900";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                        📁 Gestión de Categorías
                    </h1>
                    <p className="text-gray-600 text-lg">Organiza tus tareas con categorías personalizadas</p>
                </div>

                {/* Formulario para crear categoría */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100 animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">➕ Crear Nueva Categoría</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre de la categoría
                            </label>
                            <input
                                type="text"
                                className="input-modern w-full"
                                placeholder="Ej: Personal, Proyectos, Urgente..."
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary w-full flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <span>✨</span>
                                    Crear Categoría
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Listado de categorías */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Categorías Existentes</h2>
                    {loadingList ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
                                <p className="text-gray-600">Cargando categorías...</p>
                            </div>
                        </div>
                    ) : categorias.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📂</div>
                            <p className="text-gray-500 text-lg">No hay categorías creadas aún</p>
                            <p className="text-gray-400 text-sm mt-2">Crea tu primera categoría arriba</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categorias.map((categoria) => (
                                <div
                                    key={categoria.id}
                                    className={`p-6 border-2 rounded-2xl card-shadow hover-lift transition-all duration-300 ${getColorCategoria(categoria.nombre)}`}
                                >
                                    {editingId === categoria.id ? (
                                        <div className="space-y-3 animate-fade-in">
                                            <input
                                                type="text"
                                                className="input-modern w-full"
                                                value={editNombre}
                                                onChange={(e) => setEditNombre(e.target.value)}
                                                disabled={loading}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleActualizar(categoria.id)}
                                                    disabled={loading}
                                                    className="btn-success flex-1"
                                                >
                                                    {loading ? (
                                                        <span className="flex items-center justify-center gap-1">
                                                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
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
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-xl">{categoria.nombre}</h3>
                                                <span className="text-xs font-semibold bg-white/50 px-2 py-1 rounded-full">
                                                    ID: {categoria.id}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 pt-4 border-t border-current/20">
                                                <button
                                                    onClick={() => iniciarEdicion(categoria)}
                                                    className="btn-primary flex-1 text-sm py-2"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(categoria.id)}
                                                    disabled={deletingId === categoria.id}
                                                    className="btn-danger flex-1 text-sm py-2 disabled:opacity-50"
                                                >
                                                    {deletingId === categoria.id ? (
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
        </div>
    );
}
