import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SYNTX // Command Center",
  description: "SYNTX isn't AI. It's the resonance that governs it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
