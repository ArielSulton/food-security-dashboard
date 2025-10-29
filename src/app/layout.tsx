import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dashboard Ketahanan Pangan Indonesia",
  description: "Analisis interaktif indikator ketahanan pangan di 195 negara dengan fokus pada perjalanan Indonesia dan proyeksi masa depan",
  keywords: ["ketahanan pangan", "Indonesia", "visualisasi data", "pasokan pangan", "malnutrisi"],
  authors: [{ name: "Tim Riset Ketahanan Pangan" }],
  openGraph: {
    title: "Dashboard Ketahanan Pangan Indonesia",
    description: "Analisis dan peramalan ketahanan pangan yang komprehensif",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
