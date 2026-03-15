"use client";

import { motion } from "framer-motion";
import { Sparkles, CalendarHeart, Gift, Heart, Send } from "lucide-react";
import Image from "next/image";

const STORY_STEPS = [
  {
    icon: <CalendarHeart className="w-8 h-8" />,
    title: "Momen Pertemuan",
    label: "Pilih Template",
    desc: "Awali perjalanan dengan memilih tema visual yang menggambarkan kisah cinta dan gaya pernikahan Anda.",
    image: "/images/mockup-phone.webp"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Lamaran Penuh Cinta",
    label: "Lengkapi Kisah",
    desc: "Isi data acara, ceritakan perjalanan cinta Anda, dan unggah galeri foto kebersamaan yang berkesan.",
    image: "/images/mockup-phone.webp"
  },
  {
    icon: <Send className="w-8 h-8" />,
    title: "Hari Kebahagiaan Menanti",
    label: "Bagikan Kebahagiaan",
    desc: "Undangan digital Anda siap. Bagikan kepada keluarga dan kerabat melalui satu tautan elegan.",
    image: "/images/mockup-phone.webp"
  }
];

export default function CaraKerjaSection() {
  return (
    <section id="cara-kerja" className="py-12 sm:py-20 relative overflow-hidden scroll-mt-20" style={{ background: "var(--lp-bg-section)" }}>
      {/* Soft gradient backgrounds */}
      <div className="absolute top-0 left-[-20%] w-[60%] h-[60%] rounded-full opacity-30" style={{ background: "radial-gradient(circle, var(--lp-blush) 0%, transparent 60%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-0 right-[-20%] w-[60%] h-[60%] rounded-full opacity-30" style={{ background: "radial-gradient(circle, var(--lp-gold-light) 0%, transparent 60%)", filter: "blur(80px)" }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: "var(--lp-gold)" }}>
            Perjalanan Membuat Undangan
          </span>
          <h2 className="text-[2.5rem] leading-[1.1] sm:text-5xl font-serif font-bold mb-3 sm:mb-4" style={{ color: "var(--lp-cream)" }}>
            Bagian dari <span style={{ color: "var(--lp-gold)", fontStyle: "italic" }}>Kisah Cinta Anda</span>
          </h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed px-2 sm:px-0" style={{ color: "var(--lp-text-muted)" }}>
            3 langkah mudah dan romantis memberikan pengalaman terbaik 
            bagi tamu sebelum hari pernikahan tiba.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Connector Line */}
          <div className="hidden md:block absolute top-[60px] bottom-[60px] left-1/2 w-[1px] -translate-x-1/2" style={{ background: "linear-gradient(to bottom, transparent, var(--lp-gold), transparent)" }} />

          {STORY_STEPS.map((step, i) => (
            <motion.div 
              key={i} 
              className={`flex flex-col md:flex-row items-center justify-between mb-12 md:mb-16 relative ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Timeline dot - Glass Style */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl items-center justify-center shadow-xl z-10 backdrop-blur-xl border border-[var(--lp-gold)]/20" 
                   style={{ background: "rgba(255, 255, 255, 0.8)", color: "var(--lp-gold)" }}>
                <div className="w-8 h-8 opacity-80">{step.icon}</div>
              </div>

              {/* Text Content */}
              <div className={`w-full md:w-5/12 text-center ${i % 2 !== 0 ? 'md:text-left' : 'md:text-right'} mb-10 md:mb-0`}>
                <motion.div 
                  className="inline-block px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-sm border border-[var(--lp-gold)]/10"
                  style={{ background: "rgba(255, 255, 255, 0.6)", color: "var(--lp-gold)" }}
                  whileHover={{ scale: 1.05 }}
                >
                  {step.label}
                </motion.div>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold mb-4 sm:mb-6 leading-tight" style={{ color: "var(--lp-cream)" }}>
                  {step.title}
                </h3>
                <p className="text-base sm:text-lg font-light leading-relaxed px-4 sm:px-0 opacity-80" style={{ color: "var(--lp-text-muted)" }}>
                  {step.desc}
                </p>
              </div>

              {/* Visual/Image - Premium Glass Frame */}
              <div className={`w-full md:w-5/12 flex justify-center ${i % 2 !== 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                <motion.div 
                  className="relative group w-72 h-96 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700"
                  whileHover={{ y: -10 }}
                  style={{ 
                    background: "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(20px)",
                    border: "8px solid rgba(255, 255, 255, 0.8)",
                  }}
                >
                  <Image 
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  {/* Subtle glass reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
