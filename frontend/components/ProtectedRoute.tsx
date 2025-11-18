"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Verificar si hay un usuario logueado
        if (typeof window !== "undefined") {
            const userId = localStorage.getItem("userId");
            if (userId) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                // Redirigir después de un breve delay para mostrar el mensaje
                setTimeout(() => {
                    router.push(redirectTo);
                }, 1500);
            }
            setIsChecking(false);
        }
    }, [router, redirectTo]);

    // Mostrar loading mientras se verifica
    if (isChecking || isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, mostrar mensaje antes de redirigir
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 text-center max-w-md animate-fade-in">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold gradient-text mb-3">Acceso Restringido</h2>
                    <p className="text-gray-600 mb-6">Debes iniciar sesión para acceder a esta página</p>
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                        <span className="text-sm font-medium">Redirigiendo al login...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Si está autenticado, mostrar el contenido
    return <>{children}</>;
}
