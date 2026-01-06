import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KAMA | Магазин пижам",
  description: "Интерактивный каталог пижам KAMA — выберите идеальную пижаму в нашем магазине",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KAMA",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#D4A574",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${outfit.variable} ${inter.variable}`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
