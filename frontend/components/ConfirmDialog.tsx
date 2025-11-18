"use client";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    type = "danger"
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const getStyles = () => {
        switch (type) {
            case "danger":
                return "bg-gradient-to-r from-red-500 to-rose-600";
            case "warning":
                return "bg-gradient-to-r from-yellow-500 to-amber-600";
            case "info":
                return "bg-gradient-to-r from-blue-500 to-indigo-600";
            default:
                return "bg-gradient-to-r from-gray-500 to-gray-600";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full mx-4 animate-fade-in border-2 border-gray-100">
                <div className="text-center mb-6">
                    <div className="text-5xl mb-4">
                        {type === "danger" ? "⚠️" : type === "warning" ? "⚠️" : "ℹ️"}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600">{message}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 btn-secondary py-3"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 ${getStyles()} text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

