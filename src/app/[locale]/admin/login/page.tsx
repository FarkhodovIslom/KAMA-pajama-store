"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/admin";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Произошла ошибка");
            } else {
                router.push(redirect);
                router.refresh();
            }
        } catch {
            setError("Ошибка соединения с сервером");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">K</span>
                        </div>
                        <div className="text-left">
                            <h1 className="text-2xl font-bold text-[var(--text)]">KAMA Admin</h1>
                            <p className="text-sm text-[var(--text-muted)]">Панель управления</p>
                        </div>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-[var(--surface)] rounded-[var(--radius-card)] shadow-sm border border-[var(--border)] p-8">
                    <h2 className="text-lg font-semibold text-[var(--text)] mb-6">
                        Вход
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                                Имя пользователя
                            </label>
                            <input
                                id="username"
                                type="text"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-colors text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none"
                                placeholder="admin"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                                Пароль
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-colors text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none"
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={isLoading || !username || !password}
                            className="w-full py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Вход...
                                </span>
                            ) : (
                                "Войти"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-[var(--text-muted)] mt-6">
                    KAMA Pajama Store <FontAwesomeIcon icon={faCopyright} /> 2024
                </p>
            </div>
        </div>
    );
}
