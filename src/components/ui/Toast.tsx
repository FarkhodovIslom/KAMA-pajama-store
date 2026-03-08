"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast ${toast.type}`}
                    >
                        {toast.type === "success" && (
                            <FontAwesomeIcon icon={faCheck} style={{ width: 16, height: 16, color: "var(--success)" }} />
                        )}
                        {toast.type === "error" && (
                            <FontAwesomeIcon icon={faXmark} style={{ width: 16, height: 16, color: "var(--error)" }} />
                        )}
                        {toast.type === "info" && (
                            <FontAwesomeIcon icon={faInfoCircle} style={{ width: 16, height: 16, color: "var(--text-muted)" }} />
                        )}
                        <span style={{ flex: 1 }}>{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", opacity: 0.6 }}
                        >
                            <FontAwesomeIcon icon={faXmark} style={{ width: 14, height: 14 }} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
