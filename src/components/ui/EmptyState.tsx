import React from "react";
import Link from "next/link";
import Button from "./Button";

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    title,
    description,
    icon,
    actionLabel,
    actionHref,
    onAction,
    className = "",
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-3xl bg-[var(--kama-gray-100)]/50 border border-dashed border-[var(--kama-gray-200)] ${className}`}>
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[var(--kama-gray-400)] shadow-sm mb-6">
                {icon || (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                )}
            </div>
            <h3 className="text-lg font-bold text-[var(--kama-gray-900)] mb-2">
                {title}
            </h3>
            <p className="text-[var(--kama-gray-500)] max-w-sm mb-8 text-sm leading-relaxed">
                {description}
            </p>

            {actionLabel && (
                actionHref ? (
                    <Link href={actionHref}>
                        <Button variant="primary">{actionLabel}</Button>
                    </Link>
                ) : onAction ? (
                    <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
                ) : null
            )}
        </div>
    );
}
