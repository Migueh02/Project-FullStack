// Página de login
"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "../../hooks/useToast";

export default function LoginPage() {
    const { showToast, ToastContainer } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            showToast("El email es requerido", "warning");
            return;
        }

        if (!password.trim()) {
            showToast("La contraseña es requerida", "warning");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:4000/api/auth/login", {
                email: email.trim(),
                password: password.trim()
            });

            if (response.data.success) {
                // Guardar userId en localStorage
                localStorage.setItem("userId", response.data.userId.toString());
                localStorage.setItem("userEmail", response.data.email || email);
                
                showToast("¡Bienvenido de vuelta!", "success");
                
                // Redirigir a la página principal después de un breve delay
                setTimeout(() => {
                    router.push("/");
                }, 500);
            } else {
                showToast(response.data.error || "Error al iniciar sesión", "error");
            }
        } catch (error: any) {
            console.error("Error en login:", error);
            const errorMessage = error.response?.data?.error || "Error al iniciar sesión. Verifica tus credenciales.";
            showToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 animate-fade-in">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🔐</div>
                            <h2 className="text-3xl font-bold gradient-text mb-2">Iniciar Sesión</h2>
                            <p className="text-gray-600">Bienvenido de vuelta a TaskHub</p>
                        </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                className="input-modern w-full"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                className="input-modern w-full"
                                placeholder="Tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
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
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    <span>🚀</span>
                                    Iniciar Sesión
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes una cuenta?{" "}
                            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
