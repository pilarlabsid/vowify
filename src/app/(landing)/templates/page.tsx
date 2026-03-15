"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ACTIVE_TEMPLATES } from "@/templates/registry";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Petals from "../components/Petals";

export default function TemplatesPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <main data-zone="landing" className="min-h-screen pt-32 pb-24 overflow-hidden relative" style={{ background: "var(--lp-bg)" }}>
      <Petals count={20} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Link href="/#template" className="inline-flex items-center gap-2 mb-8 font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--lp-gold)" }}>
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: "var(--lp-gold)" }}>
            Katalog Lengkap
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4" style={{ color: "var(--lp-cream)" }}>
            Temukan Tema <span style={{ color: "var(--lp-gold)", fontStyle: "italic" }}>Sempurna</span>
          </h1>
          <p className="max-w-2xl text-lg font-light leading-relaxed" style={{ color: "var(--lp-text-muted)" }}>
            Jelajahi seluruh koleksi desain undangan digital premium kami. Masing-masing dirancang untuk menceritakan kisah Anda yang unik.
          </p>
        </motion.div>

        {/* Interactive Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {ACTIVE_TEMPLATES.map((t, i) => (
            <motion.a
              href={`/preview/${t.id}`}
              target="_blank"
              key={t.id}
              className="relative flex flex-col group rounded-[2rem] overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (i % 8) * 0.1 }}
              style={{
                background: "var(--lp-bg-card)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
                border: "1px solid var(--lp-border-subtle)",
              }}
              whileHover={{ y: -10, boxShadow: "0 20px 50px rgba(168, 129, 50, 0.15)", borderColor: "var(--lp-gold)" }}
            >
              {/* Preview Window */}
              <div
                className="h-64 sm:h-72 w-full flex flex-col items-center justify-center relative overflow-hidden transition-all duration-700 bg-stone-100"
              >
                <Image
                  src={t.previewImage}
                  alt={t.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle animated background radial glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.15] transition-opacity duration-700"
                  style={{ backgroundImage: `radial-gradient(circle at 50% 50%, var(--lp-gold) 0%, transparent 80%)` }}
                />
              </div>

              {/* Title and Desc */}
              <div className="p-6 relative z-10 bg-white flex flex-col flex-1">
                <h3 className="font-serif font-bold text-xl mb-2 flex items-center gap-2 flex-wrap" style={{ color: "var(--lp-cream)" }}>
                  {t.name}
                  {t.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-sans uppercase tracking-widest font-bold shrink-0" style={{ background: "var(--lp-gold-dim)", color: "var(--lp-gold)" }}>{t.badge}</span>
                  )}
                </h3>
                <p className="text-sm font-light leading-relaxed line-clamp-2 mb-6" style={{ color: "var(--lp-text-muted)" }}>
                  {t.description}
                </p>
                <div className="mt-auto flex items-center gap-2 text-xs font-bold transition-all duration-300 group-hover:gap-3"
                      style={{ color: "var(--lp-gold)" }}>
                  Prakatinjau Langsung
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Decorative side accent line */}
              <motion.div 
                className="absolute left-0 bottom-0 w-full h-[3px] z-20"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: hoveredIndex === i ? 1 : 0 }}
                style={{ originX: 0, background: "var(--lp-gold)" }}
                transition={{ duration: 0.4 }}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </main>
  );
}
