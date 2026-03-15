"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 sm:py-20 relative overflow-hidden" style={{ background: "var(--lp-bg-section)" }}>
      {/* Subtle Divider Bloom */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[var(--lp-gold)]/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 mb-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl font-script" style={{ color: "var(--lp-gold)" }}>Vowify.id</span>
            </Link>
            <p className="text-sm sm:text-base font-light leading-relaxed max-w-sm opacity-80" style={{ color: "var(--lp-text-muted)" }}>
              Platform undangan pernikahan digital elegan yang merangkai kisah cinta Anda menjadi kenangan abadi bagi setiap tamu.
            </p>
            <div className="flex gap-4 mt-6 sm:mt-8">
              {[Instagram, Facebook, Twitter, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[var(--lp-gold)]/10" style={{ background: "rgba(255, 255, 255, 0.5)", border: "1px solid rgba(168, 129, 50, 0.1)", color: "var(--lp-gold)" }}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:pl-10">
            <h4 className="font-serif font-bold text-base sm:text-lg mb-4 sm:mb-6" style={{ color: "var(--lp-cream)" }}>Produk</h4>
            <ul className="flex flex-col gap-3 sm:gap-4">
              {["Template", "Fitur", "Harga", "Demo"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="text-sm font-light transition-all duration-300 hover:translate-x-1 hover:text-[var(--lp-gold)]" style={{ color: "var(--lp-text-muted)" }}>{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-base sm:text-lg mb-4 sm:mb-6" style={{ color: "var(--lp-cream)" }}>Akun</h4>
            <ul className="flex flex-col gap-3 sm:gap-4">
              {[
                { l: "Daftar", h: "/register" },
                { l: "Masuk", h: "/login" },
                { l: "Dashboard", h: "/dashboard" },
              ].map(({ l, h }) => (
                <li key={l}>
                  <Link href={h} className="text-sm font-light transition-all duration-300 hover:translate-x-1 hover:text-[var(--lp-gold)]" style={{ color: "var(--lp-text-muted)" }}>{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase" style={{ borderTop: "1px solid rgba(168, 129, 50, 0.1)", color: "var(--lp-text-muted)" }}>
          <p className="text-center sm:text-left">© {new Date().getFullYear()} Vowify.id</p>
          <div className="flex gap-4 sm:gap-8">
            <a href="#" className="transition-colors hover:text-[var(--lp-gold)]">Kebijakan Privasi</a>
            <a href="#" className="transition-colors hover:text-[var(--lp-gold)]">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
