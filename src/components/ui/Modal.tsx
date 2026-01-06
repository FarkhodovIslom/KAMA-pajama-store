"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            onClick={(e) => e.target === overlayRef.current && onClose()}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" />

            {/* Modal Content */}
            <div className="relative bg-[var(--kama-white)] rounded-[var(--radius-xl)] shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden animate-scale-in">
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--kama-gray-200)]">
                        <h2 className="text-xl font-semibold text-[var(--kama-gray-900)]">{title}</h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--kama-beige)] transition-colors"
                            aria-label="Закрыть"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
                    {children}
                </div>
            </div>
        </div>
    );
}
