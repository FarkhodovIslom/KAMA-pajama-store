import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-md bg-[var(--kama-gray-200)] ${className}`}
            {...props}
        />
    );
}

// Pre-configured skeleton variants for common UI patterns
export function CardSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            <Skeleton className="aspect-[4/5] rounded-2xl w-full" />
            <div className="flex justify-between items-start pt-1">
                <div className="space-y-2 flex-1 pr-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-5 w-16" />
            </div>
        </div>
    );
}
