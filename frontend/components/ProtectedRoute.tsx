"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Verificar si hay un usuario logueado
        if (typeof window !== "undefined") {
            const userId = localStorage.getItem("userId");
            if (userId) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                router.push("/login");
            }
        }
    }, [router]);

    // Mostrar loading mientras se verifica
    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, no mostrar nada (ya se redirigió)
    if (!isAuthenticated) {
        return null;
    }

    // Si está autenticado, mostrar el contenido
    return <>{children}</>;
}

