"use client";
import { useEffect } from "react";

interface ToastProps {
    message: string;
    type: "success" | "error" | "warning" | "info";
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const getIcon = () => {
        switch (type) {
            case "success":
                return "✅";
            case "error":
                return "❌";
            case "warning":
                return "⚠️";
            case "info":
                return "ℹ️";
            default:
                return "ℹ️";
        }
    };

    const getStyles = () => {
        switch (type) {
            case "success":
                return "bg-gradient-to-r from-green-500 to-emerald-600 border-green-400";
            case "error":
                return "bg-gradient-to-r from-red-500 to-rose-600 border-red-400";
            case "warning":
                return "bg-gradient-to-r from-yellow-500 to-amber-600 border-yellow-400";
            case "info":
                return "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-400";
            default:
                return "bg-gradient-to-r from-gray-500 to-gray-600 border-gray-400";
        }
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 ${getStyles()} text-white px-6 py-4 rounded-xl shadow-2xl border-2 animate-fade-in flex items-center gap-3 min-w-[300px] max-w-md`}
            role="alert"
        >
            <span className="text-2xl">{getIcon()}</span>
            <p className="flex-1 font-semibold">{message}</p>
            <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors text-xl font-bold"
                aria-label="Cerrar"
            >
                ×
            </button>
        </div>
    );
}

