"use client";

import Link from "next/link";
import { Heart, Sparkles, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSession } from "next-auth/react";
import Petals from "./Petals";

export default function HeroSection() {
  const { scrollY } = useScroll();
  const { data: session } = useSession();
  const yText = useTransform(scrollY, [0, 500], [0, 100]);
  const opacityText = useTransform(scrollY, [0, 400], [1, 0]);
  const scaleText = useTransform(scrollY, [0, 400], [1, 0.95]);

  const words = "Undangan Digital yang".split(" ");
  const highlightWords = "Elegan & Romantis".split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-10 sm:py-20 px-4 sm:px-0" style={{ background: "var(--lp-bg)" }}>
      {/* Subtle Background Glows - Premium Layering */}
      <div className="absolute top-[5%] left-[-5%] w-[35%] h-[35%] opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, var(--lp-blush) 0%, transparent 70%)", filter: "blur(100px)" }} />
      <div className="absolute bottom-[5%] right-[-5%] w-[35%] h-[35%] opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, var(--lp-gold-dim) 0%, transparent 70%)", filter: "blur(100px)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[700px] opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, var(--lp-gold-dim) 0%, transparent 70%)", filter: "blur(120px)" }} />

      {/* Ornament Decoration - Consistent Circles */}
      <motion.div
        className="absolute top-[15%] right-[10%] opacity-[0.05] hidden lg:block lp-animate-float"
        style={{ width: "250px", height: "250px", borderRadius: "50%", border: "2px solid var(--lp-gold)" }}
      />
      <motion.div
        className="absolute top-[20%] right-[12%] opacity-[0.03] hidden lg:block lp-animate-float [animation-delay:1.5s]"
        style={{ width: "180px", height: "180px", borderRadius: "50%", border: "1px solid var(--lp-gold)" }}
      />

      <motion.div
        className="absolute bottom-[20%] left-[10%] opacity-[0.05] hidden lg:block lp-animate-float"
        style={{ width: "200px", height: "200px", borderRadius: "50%", border: "2px solid var(--lp-gold)" }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[12%] opacity-[0.03] hidden lg:block lp-animate-float [animation-delay:1s]"
        style={{ width: "150px", height: "150px", borderRadius: "50%", border: "1px solid var(--lp-gold)" }}
      />

      {/* Petals falling on top of the image but behind content */}
      <Petals count={30} />

      {/* Content */}
      <motion.div
        className="relative z-20 max-w-4xl mx-auto px-6 text-center w-full"
        style={{ y: yText, opacity: opacityText, scale: scaleText }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--lp-gold)]/20 bg-[var(--lp-gold)]/5 backdrop-blur-sm"
          >
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[var(--lp-gold)]">
              Sebuah Lembaran Baru
            </span>
          </motion.div>
        </div>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="text-[2.5rem] leading-[1.15] sm:text-6xl md:text-7xl font-serif font-bold sm:leading-tight mb-5 sm:mb-8"
          style={{ color: "var(--lp-cream)" }}
        >
          <div className="flex flex-wrap justify-center gap-x-[0.3em]">
            {words.map((word, index) => (
              <motion.span variants={child} key={index}>
                {word}
              </motion.span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-[0.3em] mt-1 sm:mt-2">
            {highlightWords.map((word, index) => (
              <motion.span
                variants={child}
                key={index}
                className="lp-gold-shimmer px-4 inline-block"
                style={{ fontStyle: "italic" }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.h1>

        <p
          className="text-base sm:text-lg md:text-xl leading-relaxed mb-10 sm:mb-12 max-w-2xl mx-auto font-light px-4 sm:px-0"
          style={{ color: "var(--lp-text)" }}
        >
          Ceritakan kisah cinta Anda dan bagikan momen bahagia kepada
          orang-orang tercinta dengan pengalaman membuka undangan yang tak terlupakan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto"
          >
            <Link
              href={session ? ((session.user as any)?.role === 'admin' ? '/admin' : '/dashboard') : "/register"}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-12 sm:py-5 rounded-full font-bold text-sm overflow-hidden shadow-[0_20px_40px_-10px_rgba(168,129,50,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(168,129,50,0.4)] transition-shadow duration-300"
              style={{
                background: "var(--lp-gold)",
                color: "#FFFFFF",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10" />
              <Sparkles className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{session ? 'Ke Dashboard' : 'Buat Undangan Sekarang'}</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="#demo"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-12 sm:py-5 rounded-full font-bold text-sm backdrop-blur-md border shadow-sm hover:shadow-md transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.4)",
                borderColor: "rgba(168, 129, 50, 0.2)",
                color: "var(--lp-gold)",
              }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span>Lihat Demo</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator - Hidden on mobile to prevent clutter/overlap */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "var(--lp-text-muted)" }}>Gulir ke bawah</span>
        <ChevronDown className="w-5 h-5" style={{ color: "var(--lp-gold)" }} />
      </motion.div>
    </section>
  );
}
