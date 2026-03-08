import { TELEGRAM_LINK } from "@/lib/constants";

export default function SettingsPage() {
    return (
        <div className="space-y-8 max-w-2xl">
            <h1 className="text-2xl font-bold text-[var(--text)]">Настройки</h1>

            {/* Store Info */}
            <div className="bg-[var(--surface)] rounded-[var(--radius-card)] shadow-sm border border-[var(--border)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)]">
                    <h2 className="font-semibold text-[var(--text)]">Информация о магазине</h2>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <div>
                        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">Название магазина</p>
                        <p className="font-semibold text-[var(--text)]">KAMA Pajama Store</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">Ссылка на Telegram</p>
                        <a
                            href={TELEGRAM_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--primary)] hover:underline text-sm"
                        >
                            {TELEGRAM_LINK}
                        </a>
                    </div>
                </div>
            </div>

            {/* Coming Soon */}
            <div className="bg-[var(--surface)] rounded-[var(--radius-card)] shadow-sm border border-[var(--border)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)]">
                    <h2 className="font-semibold text-[var(--text)]">Будущие настройки</h2>
                </div>
                <div className="px-6 py-5 space-y-3 text-sm text-[var(--text-muted)]">
                    <p className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--subtle)] flex items-center justify-center text-xs">○</span>
                        Загрузка логотипа и баннера
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--subtle)] flex items-center justify-center text-xs">○</span>
                        Изменение основного цвета
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--subtle)] flex items-center justify-center text-xs">○</span>
                        Уведомления Telegram бота
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--subtle)] flex items-center justify-center text-xs">○</span>
                        Изменение пароля администратора
                    </p>
                </div>
            </div>
        </div>
    );
}
