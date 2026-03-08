import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import CartSidebar from "@/components/cart/CartSidebar";
import ClientLayout from "@/components/layout/ClientLayout";
import { ToastProvider } from "@/components/ui/Toast";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kama-store.uz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KAMA | Пижама магазин",
    template: "%s | KAMA",
  },
  description: "KAMA — магазин качественных пижам. Женские, мужские и детские пижамы.",
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "KAMA Пижамы",
    title: "KAMA | Пижама магазин",
    description: "KAMA — магазин качественных пижам. Женские, мужские и детские пижамы.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "KAMA Пижамы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KAMA | Пижама магазин",
    description: "KAMA — магазин качественных пижам.",
    images: ["/og-default.jpg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KAMA",
    startupImage: "/icons/apple-touch-icon.png",
  },
  icons: {
    icon: [
      { url: "/icons/icon-48.png", sizes: "48x48" },
      { url: "/icons/icon-192.png", sizes: "192x192" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FEF6F0",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "ru";
  const messages = await getMessages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KAMA Пижамы",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://kama-store.uz",
    description: "Магазин качественных пижам",
    contactPoint: { "@type": "ContactPoint", contactType: "customer service" },
  };

  return (
    <html lang={locale} className={nunito.variable}>
      <head>
        {/* Borel font for headings/logo */}
        <link
          href="https://fonts.googleapis.com/css2?family=Borel&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col pt-safe" style={{ fontFamily: "var(--font-body)", background: "var(--bg)", color: "var(--text)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ToastProvider>
            <CartProvider>
              <ClientLayout
                header={<Header />}
                cartSidebar={<CartSidebar />}
                footer={<Footer />}
                bottomNav={<BottomNav />}
              >
                {children}
              </ClientLayout>
            </CartProvider>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}