import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "UMKM Kece | Profil Bisnis & Produk Lokal",
  description: "Website resmi UMKM Kece untuk katalog produk, artikel terbaru, dan galeri foto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
