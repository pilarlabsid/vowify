import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const pinyon = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Vowify.id – Undangan Pernikahan Digital",
  description: "Platform undangan pernikahan digital premium berbasis tema adat Jawa modern.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${pinyon.variable} font-body bg-cream text-primary antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
