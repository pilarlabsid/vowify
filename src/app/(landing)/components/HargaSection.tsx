"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { PRICING } from "./data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 25 } }
};

export default function HargaSection() {
  return (
    <section
      id="harga"
      className="py-12 sm:py-24 scroll-mt-20 overflow-visible"
      style={{ background: "var(--lp-bg-section)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10 sm:mb-14">
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-4 block"
            style={{ color: "var(--lp-gold)" }}
          >
            Paket Harga
          </span>
          <h2
            className="text-[2.5rem] leading-[1.1] sm:text-4xl font-serif font-bold mb-4"
            style={{ color: "var(--lp-cream)" }}
          >
            Pilih Paket Sesuai{" "}
            <span style={{ color: "var(--lp-gold)" }}>Kebutuhan Anda</span>
          </h2>
          <p className="max-w-xl mx-auto text-base" style={{ color: "var(--lp-text-muted)" }}>
            Harga terjangkau, fitur lengkap. Tidak ada biaya tersembunyi.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {PRICING.map((p, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`rounded-[2rem] flex flex-col relative z-10 h-full group will-change-transform`}
              style={{
                background: p.highlight 
                  ? "rgba(255, 255, 255, 0.75)" 
                  : "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(24px)",
                border: `1px solid ${p.highlight ? "rgba(168, 129, 50, 0.3)" : "rgba(168, 129, 50, 0.12)"}`,
                boxShadow: p.highlight 
                  ? "0 20px 50px -15px rgba(168,129,50,0.15)" 
                  : "0 10px 30px -10px rgba(0,0,0,0.04)",
              }}
              whileHover={{ 
                y: -10, 
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                borderColor: "rgba(168, 129, 50, 0.4)",
                boxShadow: "0 30px 60px -20px rgba(168, 129, 50, 0.2)",
              }}
            >
              {p.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-full flex justify-center">
                  <div 
                    className="px-5 py-1.5 rounded-full text-[9px] font-bold tracking-[0.25em] uppercase flex items-center gap-2 shadow-xl border border-white/20"
                    style={{ 
                      background: "linear-gradient(135deg, var(--lp-gold) 0%, #D4AF37 100%)", 
                      color: "#FFFFFF",
                    }}
                  >
                    <span>✨ Paling Populer ✨</span>
                  </div>
                </div>
              )}

              <div className="p-8 sm:p-7 flex flex-col gap-6 flex-1 relative z-10">
                <div className="text-center">
                  <h3
                    className="font-serif font-bold text-2xl mb-1"
                    style={{ color: "var(--lp-cream)" }}
                  >
                    {p.name}
                  </h3>
                  <p
                    className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-60"
                    style={{ color: "var(--lp-gold)" }}
                  >
                    {p.sub}
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-baseline gap-1">
                    {p.price !== "Gratis" && (
                      <span className="text-sm font-serif font-bold" style={{ color: "var(--lp-gold)" }}>
                        Rp
                      </span>
                    )}
                    <span className="text-3xl font-serif font-bold tracking-tight" style={{ color: "var(--lp-cream)" }}>
                      {p.price.replace("Rp", "").trim()}
                    </span>
                    {p.price !== "Gratis" && (
                      <span className="text-[11px] opacity-50 font-medium ml-0.5" style={{ color: "var(--lp-text)" }}>
                        / sekali bayar
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-8 h-[1px] mx-auto opacity-50" style={{ background: "var(--lp-gold)" }} />

                <ul className="flex flex-col gap-3">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-xs group/item">
                      <div 
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-white/50 border border-[var(--lp-gold)]/10"
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: "var(--lp-gold)" }} />
                      </div>
                      <span className="font-light opacity-80" style={{ color: "var(--lp-text)" }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={p.href}
                  className={`mt-4 text-center py-3.5 rounded-xl font-bold text-[9px] tracking-[0.2em] uppercase transition-all duration-300 shadow-lg border ${
                    p.highlight 
                      ? "bg-[var(--lp-gold)] text-white border-[var(--lp-gold)]" 
                      : "bg-white text-[var(--lp-gold)] border-[var(--lp-gold)]/20 hover:border-[var(--lp-gold)]/40"
                  }`}
                  style={p.highlight ? {
                    background: "linear-gradient(135deg, var(--lp-gold) 0%, #D4AF37 100%)",
                  } : {}}
                >
                  {p.cta}
                </Link>
              </div>

              {/* Decorative Corner Glow */}
              <div 
                className={`absolute bottom-0 right-0 w-20 h-20 rounded-full -mr-10 -mb-10 blur-2xl opacity-30 pointer-events-none ${p.highlight ? 'bg-[var(--lp-gold)]' : 'bg-[var(--lp-blush)]'}`} 
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
