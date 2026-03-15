import type { Metadata } from "next";
import MusicPlayer from "./components/MusicPlayer";

export const metadata: Metadata = {
  title: "Vowify.id – Undangan Pernikahan Digital",
  description:
    "Platform undangan pernikahan digital elegan. Pilih template indah, isi data acara, dan bagikan undangan langsung ke keluarga dan teman melalui WhatsApp.",
  keywords: [
    "undangan pernikahan digital",
    "undangan online",
    "wedding invitation",
    "undangan WhatsApp",
    "vowify",
  ],
  openGraph: {
    title: "Vowify.id – Undangan Pernikahan Digital",
    description:
      "Buat undangan pernikahan digital yang elegan dalam hitungan menit. Pilih template, isi data, dan bagikan via WhatsApp.",
    type: "website",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-zone="landing" className="relative">
      <MusicPlayer />
      {children}
    </div>
  );
}
