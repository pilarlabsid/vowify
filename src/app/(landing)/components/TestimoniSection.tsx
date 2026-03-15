"use client";

import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "./data";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } }
};

export default function TestimoniSection() {
  return (
    <section id="testimoni" className="py-16 sm:py-20 relative overflow-hidden scroll-mt-20" style={{ background: "var(--lp-bg)" }}>
      {/* Decorative Elements */}
      <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, var(--lp-blush) 0%, transparent 70%)", filter: "blur(100px)" }} />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, var(--lp-gold-dim) 0%, transparent 70%)", filter: "blur(100px)" }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: "var(--lp-gold)" }}>
            Bagian dari Cerita Indah
          </span>
          <h2 className="text-[2.5rem] leading-[1.1] sm:text-5xl font-serif font-bold mb-6" style={{ color: "var(--lp-cream)" }}>
            Testimoni <span style={{ color: "var(--lp-gold)", fontStyle: "italic" }}>Pasangan Bahagia</span>
          </h2>
          <div className="w-12 h-0.5 bg-[var(--lp-gold)]/30 mx-auto" />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.4 } }}
              className="group p-8 rounded-[2.5rem] flex flex-col gap-6 relative overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(168, 129, 50, 0.1)",
                boxShadow: "0 15px 35px -10px rgba(0,0,0,0.03)",
              }}
            >
              {/* Star Rating */}
              <div className="flex justify-between items-start">
                <div className="flex gap-1">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-sm" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-[var(--lp-gold)]/10" />
              </div>

              {/* Testimonial Text */}
              <p className="text-base font-light leading-relaxed italic opacity-90 flex-1 px-1" style={{ color: "var(--lp-text)" }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-6 mt-2" style={{ borderTop: "1px solid rgba(168, 129, 50, 0.1)" }}>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-serif font-bold text-lg shadow-sm"
                  style={{ 
                    background: "linear-gradient(135deg, white 0%, var(--lp-gold-dim) 100%)", 
                    color: "var(--lp-gold)" 
                  }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-serif font-bold text-lg" style={{ color: "var(--lp-cream)" }}>
                    {t.name}
                  </p>
                  <p className="text-[10px] font-bold tracking-widest uppercase opacity-60" style={{ color: "var(--lp-text-muted)" }}>
                    {t.date}
                  </p>
                </div>
              </div>

              {/* Background Accent */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-[var(--lp-gold)] opacity-[0.02] rounded-full translate-x-12 translate-y-12 blur-2xl group-hover:opacity-[0.05] transition-opacity duration-700" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
