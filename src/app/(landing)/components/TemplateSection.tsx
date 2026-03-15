"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ACTIVE_TEMPLATES } from "@/templates/registry";
import { ArrowRight } from "lucide-react";

export default function TemplateSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displayedTemplates = ACTIVE_TEMPLATES.slice(0, 8);

  return (
    <section id="template" className="py-12 sm:py-20 overflow-hidden scroll-mt-20" style={{ background: "var(--lp-bg)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: "var(--lp-gold)" }}>
            Koleksi Berkelas
          </span>
          <h2 className="text-[2.5rem] leading-[1.1] sm:text-5xl font-serif font-bold mb-4 sm:mb-6" style={{ color: "var(--lp-cream)" }}>
            Kurasi Tema <br className="sm:hidden" /><span style={{ color: "var(--lp-gold)", fontStyle: "italic" }}>Sempurna</span>
          </h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed px-2 sm:px-0" style={{ color: "var(--lp-text-muted)" }}>
            Setiap desain adalah kanvas kosong yang siap menceritakan keunikan hari bahagia Anda.
          </p>
        </motion.div>

        {/* Interactive Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayedTemplates.map((t, i) => (
            <motion.a
              href={`/preview/${t.id}`}
              target="_blank"
              key={t.id}
              className="relative flex flex-col group rounded-[2.5rem] overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              style={{
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(168, 129, 50, 0.1)",
              }}
              whileHover={{ 
                y: -10, 
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderColor: "rgba(168, 129, 50, 0.3)",
                boxShadow: "0 30px 60px -15px rgba(168, 129, 50, 0.1)"
              }}
            >
              {/* Preview Window Area - Single Focus */}
              <div className="h-72 w-full relative overflow-hidden bg-stone-100">
                <Image
                  src={t.previewImage}
                  alt={t.name}
                  fill
                  className="object-cover transition-transform duration-[1s] ease-out group-hover:scale-105"
                />
                
                {/* Clean Hover Overlay */}
                <div className="absolute inset-0 bg-[var(--lp-gold)]/0 group-hover:bg-[var(--lp-gold)]/5 transition-colors duration-500" />

                {/* Status Badge */}
                {t.badge && (
                  <div className="absolute top-5 left-5 z-20">
                    <span className="text-[9px] px-3 py-1.5 rounded-full bg-white/90 border border-stone-100 text-[var(--lp-gold)] font-bold tracking-[0.15em] uppercase shadow-sm">
                      {t.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Content - Simple & Clean */}
              <div className="p-8 pb-10 relative z-10 flex flex-col items-center text-center">
                <h3 className="font-serif font-bold text-2xl mb-3" style={{ color: "var(--lp-cream)" }}>
                  {t.name}
                </h3>
                <p className="text-sm font-light leading-relaxed line-clamp-2" style={{ color: "var(--lp-text-muted)" }}>
                  {t.description}
                </p>
                
                {/* Minimalist Action Indicator */}
                <div className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--lp-gold)] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  Lihat Detail <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Show More Button if there are more than 8 templates */}
        {ACTIVE_TEMPLATES.length > 8 && (
          <motion.div 
            className="mt-16 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/templates"
              className="px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg flex items-center gap-3 hover:opacity-90"
              style={{ background: "var(--lp-gold)", color: "white", boxShadow: "0 10px 30px rgba(168, 129, 50, 0.2)" }}
            >
              Lihat Semua Koleksi
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
