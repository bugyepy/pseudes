import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pseudes - Pesting for quickly.",
  description: "Easily evolve into a 先生.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
