"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { FAQS } from "./data";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 sm:py-32 relative overflow-hidden scroll-mt-20" style={{ background: "var(--lp-bg)" }}>
      {/* Premium Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] opacity-[0.05] blur-[120px]" style={{ background: "var(--lp-gold)" }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] opacity-[0.05] blur-[120px]" style={{ background: "var(--lp-blush)" }} />
      </div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[1px]" style={{ background: "linear-gradient(to right, transparent, var(--lp-gold))" }} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: "var(--lp-gold)" }}>Bantuan & FAQ</span>
            <div className="w-10 h-[1px]" style={{ background: "linear-gradient(to left, transparent, var(--lp-gold))" }} />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4" style={{ color: "var(--lp-cream)" }}>
            Segala yang Perlu <br className="sm:hidden" />
            <span style={{ color: "var(--lp-gold)", fontStyle: "italic" }}>Anda Ketahui</span>
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm opacity-70" style={{ color: "var(--lp-text)" }}>
            Temukan jawaban untuk pertanyaan yang paling sering ditanyakan mengenai layanan undangan digital kami.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group"
            >
              <div
                className={`rounded-[1.5rem] transition-all duration-500 overflow-hidden ${open === i ? 'shadow-xl' : 'hover:shadow-md'}`}
                style={{
                  background: open === i ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.35)",
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${open === i ? "rgba(168, 129, 50, 0.25)" : "rgba(168, 129, 50, 0.08)"}`,
                }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left outline-none"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span 
                      className="text-[10px] sm:text-xs font-serif font-bold opacity-30 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ color: "var(--lp-gold)" }}
                    >
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <span
                      className="font-serif font-medium text-sm sm:text-base transition-colors duration-500 pr-4"
                      style={{ color: open === i ? "var(--lp-gold)" : "var(--lp-cream)" }}
                    >
                      {faq.q}
                    </span>
                  </div>
                  <div 
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${open === i ? 'bg-[var(--lp-gold)] text-white shadow-lg' : 'bg-white/50 text-[var(--lp-gold)]'}`}
                    style={{ border: "1px solid rgba(168, 129, 50, 0.1)" }}
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${open === i ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-4 pb-6 sm:px-5 sm:pb-8 ml-[2.5rem] sm:ml-[3.5rem]">
                        <div className="w-10 h-[1px] rounded-full mb-4" style={{ background: "var(--lp-gold-dim)", opacity: 0.3 }} />
                        <p 
                          className="text-xs sm:text-sm font-light leading-relaxed max-w-2xl"
                          style={{ color: "var(--lp-text)" }}
                        >
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions? CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[var(--lp-gold)]/10 bg-white/30 backdrop-blur-md"
          >
            <span className="text-xs sm:text-sm font-medium" style={{ color: "var(--lp-text-muted)" }}>
              Masih punya pertanyaan lain?
            </span>
            <a 
              href="https://wa.me/your-number" 
              className="text-xs sm:text-sm font-bold underline decoration-[var(--lp-gold)]/30 underline-offset-4 hover:decoration-[var(--lp-gold)] transition-all"
              style={{ color: "var(--lp-gold)" }}
            >
              Hubungi Kami
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
