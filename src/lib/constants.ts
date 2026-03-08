// ── App-wide constants ──────────────────────────────────────────────────

export const APP_NAME = "KAMA";
export const APP_DESCRIPTION = "KAMA — premium pijama do'koni";
export const CURRENCY_CODE = "UZS";
export const LOCALE = "uz-UZ";

// ── Contact ─────────────────────────────────────────────────────────────

export const TELEGRAM_LINK = "https://t.me/kama_store";
export const INSTAGRAM_LINK = "https://instagram.com/kama_store";
export const PHONE_NUMBER = "+998 90 123 45 67";

// ── Upload ──────────────────────────────────────────────────────────────

export const MAX_UPLOAD_SIZE_MB = 5;
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const UPLOAD_DIR = "public/uploads/products";

// ── Order statuses ──────────────────────────────────────────────────────

export const ORDER_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Kutilmoqda",
  COMPLETED: "Bajarildi",
  CANCELLED: "Bekor qilindi",
};

// ── Theme ───────────────────────────────────────────────────────────────

export const THEME_COLOR = "#FEF6F0";
export const BACKGROUND_COLOR = "#FEF6F0";
