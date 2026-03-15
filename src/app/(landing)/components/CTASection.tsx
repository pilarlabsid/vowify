"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart } from "lucide-react";
import { useRef } from "react";
import { useSession } from "next-auth/react";

export default function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section 
      ref={containerRef}
      className="py-16 sm:py-24 relative overflow-hidden" 
      style={{ background: "var(--lp-bg-section)" }}
    >
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 scale-110"
        style={{ y: yBg }}
      >
        <Image 
          src="/images/cta_bg.webp" 
          alt="Wedding Background" 
          fill
          className="object-cover opacity-30"
          priority
        />
        {/* Soft Overlays to blend with the design */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-40" />
      </motion.div>

      {/* Premium Background Atmosphere Glows */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-15" 
             style={{ background: "radial-gradient(circle, var(--lp-gold-dim) 0%, transparent 60%)", filter: "blur(100px)" }} />
        
        {/* Floating Ornaments */}
        <div className="absolute top-10 left-10 w-48 h-48 rounded-full border border-[var(--lp-gold)]/10 lp-animate-float opacity-30 hidden lg:block" />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full border border-[var(--lp-gold)]/5 lp-animate-float [animation-delay:2s] opacity-20 hidden lg:block" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Main Card with Deep Glassmorphism */}
          <div 
            className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden text-center group"
            style={{ 
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(168, 129, 50, 0.12)",
              boxShadow: "0 20px 50px -10px rgba(168, 129, 50, 0.08)"
            }}
          >
            {/* Decorative Corner Glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--lp-gold)]/5 blur-2xl -mr-16 -mt-16 rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--lp-blush)]/10 blur-2xl -ml-16 -mb-16 rounded-full" />

            {/* TRUST SIGNAL BADGE */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/60 border border-[var(--lp-gold)]/10 shadow-sm mb-4 sm:mb-6"
            >
              <div className="flex -space-x-1.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-4 h-4 rounded-full border border-white bg-stone-200" />
                ))}
              </div>
              <span className="text-[8px] font-bold tracking-widest uppercase text-[var(--lp-gold)]">
                Dipakai 2.000+ Pasangan
              </span>
            </motion.div>

            <div className="relative z-10 max-w-lg mx-auto">
              {/* Dynamic Icon */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <motion.div 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center relative bg-white shadow-md border border-[var(--lp-gold)]/10"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.03, 0.97, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                >
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-[var(--lp-gold)] text-[var(--lp-gold)]" />
                  <div className="absolute inset-0 rounded-xl border border-[var(--lp-gold)]/20 animate-ping opacity-10" />
                </motion.div>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight" style={{ color: "var(--lp-cream)" }}>
                Siap Melukis <br className="hidden sm:block" />
                <span className="lp-gold-shimmer italic inline-block">Momen Bahagia?</span>
              </h2>
              
              <p className="text-xs sm:text-sm md:text-base font-light leading-relaxed mb-6 opacity-75" style={{ color: "var(--lp-text)" }}>
                Wujudkan undangan pernikahan impian Anda sekarang. <br className="hidden md:block" /> 
                Mudah, Cepat, dan Elegan — dimulai dalam hitungan menit.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    href={session ? ((session.user as any)?.role === 'admin' ? '/admin' : '/dashboard') : "/register"}
                    className="group/btn relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-10 py-3 sm:py-3.5 rounded-full font-serif font-bold text-sm sm:text-base transition-all duration-500 overflow-hidden shadow-lg"
                    style={{
                      background: "var(--lp-gold)",
                      color: "#FFFFFF",
                      boxShadow: "0 10px 25px -5px rgba(168, 129, 50, 0.3)"
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--lp-gold)] via-[#D4AF37] to-[var(--lp-gold)] bg-[length:200%_100%] animate-[lp-shimmer_3s_linear_infinite]" />
                    <div className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-[30deg] -translate-x-full group-hover/btn:translate-x-[250%] transition-transform duration-[1s] ease-in-out" />
                    <span className="relative z-10 flex items-center gap-2">
                       {session ? 'Ke Dashboard' : 'Mulai Sekarang — Gratis'}
                    </span>
                  </Link>
                </motion.div>
              </div>

              <p className="mt-5 sm:mt-6 text-[9px] sm:text-[10px] font-medium tracking-[0.05em] uppercase opacity-30 flex items-center justify-center gap-2" style={{ color: "var(--lp-text)" }}>
                <span className="w-1 h-1 rounded-full bg-green-500" /> 
                142 Orang sedang membuat undangan hari ini
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
