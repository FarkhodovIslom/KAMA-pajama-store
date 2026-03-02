import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import BottomNav from "@/components/layout/BottomNav";
import { ToastProvider } from "@/components/ui/Toast";
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
  title: "KAMA | Pijama do'koni",
  description: "KAMA interaktiv pijama katalogi — do'konimizdan mukammal pijamani tanlang",
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
  return <html lang="uz" className={`${outfit.variable} ${inter.variable}`}>
    <body className="font-body text-[var(--kama-gray-800)] antialiased min-h-screen flex flex-col pt-safe bg-[var(--kama-gray-50)] md:pb-0">
      <ToastProvider>
        <CartProvider>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <BottomNav />
        </CartProvider>
      </ToastProvider>
    </body>
  </html>
}
