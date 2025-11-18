"use client";
import { useState, useCallback } from "react";
import Toast from "../components/Toast";

interface ToastItem {
    id: number;
    message: string;
    type: "success" | "error" | "warning" | "info";
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, type: "success" | "error" | "warning" | "info" = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const ToastContainer = () => (
        <div className="fixed top-4 right-4 z-50 space-y-3">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );

    return { showToast, removeToast, ToastContainer, toasts };
}

