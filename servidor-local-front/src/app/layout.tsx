// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css"; // Voltar uma pasta para sair de 'app' e achar o globals.css em 'src'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Delícias da Isabel - Delivery",
  description: "Peça os melhores doces e salgados online!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}