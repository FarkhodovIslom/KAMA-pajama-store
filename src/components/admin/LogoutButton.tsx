"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/admin/login");
            router.refresh();
        } catch {
            // still redirect on failure  
            router.push("/admin/login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className="text-sm text-[var(--kama-gray-500)] hover:text-[var(--kama-error)] transition-colors disabled:opacity-50"
        >
            {isLoading ? "..." : "Chiqish"}
        </button>
    );
}
