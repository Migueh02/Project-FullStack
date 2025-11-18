"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Verificar si hay un usuario logueado
        if (typeof window !== "undefined") {
            const userId = localStorage.getItem("userId");
            const email = localStorage.getItem("userEmail");
            setIsLoggedIn(!!userId);
            setUserEmail(email || "");
        }
    }, [pathname]); // Re-evaluar cuando cambie la ruta

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        setUserEmail("");
        router.push("/login");
    };

    // No mostrar navbar en páginas de login/register
    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    return (
        <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="font-bold text-2xl hover:opacity-90 transition-opacity flex items-center gap-2">
                        <span className="text-3xl">📋</span>
                        <span>TaskHub</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="hover:underline font-medium transition-all hover:scale-105">
                            Inicio
                        </Link>
                        <Link href="/add" className="hover:underline font-medium transition-all hover:scale-105">
                            Nueva Tarea
                        </Link>
                        <Link href="/categorias" className="hover:underline font-medium transition-all hover:scale-105">
                            Categorías
                        </Link>
                        
                        {isLoggedIn ? (
                            <div className="flex items-center gap-4 ml-6 pl-6 border-l border-white/30">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">👤</span>
                                    <span className="text-sm font-medium">{userEmail}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 backdrop-blur-sm"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-white/30">
                                <Link
                                    href="/login"
                                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 backdrop-blur-sm"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 shadow-lg"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
