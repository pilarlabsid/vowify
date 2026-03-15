"use client";

import { motion } from "framer-motion";
import { FEATURES_DETAIL } from "./data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      type: "spring" as const, 
      stiffness: 80, 
      damping: 20 
    } 
  }
};

export default function FiturSection() {
  return (
    <section id="fitur" className="py-12 sm:py-20 relative overflow-hidden scroll-mt-20" style={{ background: "var(--lp-bg-section)" }}>
      {/* Decorative scattered petals or blobs */}
      <div className="absolute top-20 right-[-10%] w-64 h-64 rounded-full opacity-20" style={{ background: "radial-gradient(circle, var(--lp-gold) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute bottom-20 left-[-10%] w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, var(--lp-blush) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-12 sm:mb-16 px-2 sm:px-0"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: "var(--lp-gold)" }}>
            Fitur Premium
          </span>
          <h2 className="text-[2.5rem] leading-[1.1] sm:text-5xl font-serif font-bold mb-4 sm:mb-6" style={{ color: "var(--lp-cream)" }}>
            Semua yang Anda Butuhkan <br className="hidden md:block" />
            <span style={{ color: "var(--lp-gold)", fontStyle: "italic" }}>dalam Satu Undangan</span>
          </h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed" style={{ color: "var(--lp-text-muted)" }}>
            Dilengkapi teknologi modern tanpa menghilangkan esensi keanggunan pernikahan tradisional.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {FEATURES_DETAIL.map((f, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ 
                y: -12, 
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderColor: "rgba(168, 129, 50, 0.3)",
                boxShadow: "0 30px 60px -15px rgba(168, 129, 50, 0.15)",
                transition: { duration: 0.4 }
              }}
              className="group flex flex-col items-center text-center p-8 rounded-[2.5rem] relative overflow-hidden h-full"
              style={{
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(168, 129, 50, 0.1)",
              }}
            >
              {/* Animated Background Decoration for Card */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--lp-gold-dim)] rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-transform duration-500 group-hover:scale-110"
                style={{ 
                  background: "linear-gradient(135deg, var(--lp-gold-dim) 0%, rgba(255,255,255,0.8) 100%)", 
                  color: "var(--lp-gold)",
                  boxShadow: "0 10px 20px -5px rgba(168, 129, 50, 0.1)"
                }}
              >
                <div className="w-6 h-6">{f.icon}</div>
              </div>
              
              <h3 className="font-serif font-bold text-xl mb-4 relative z-10" style={{ color: "var(--lp-cream)" }}>
                {f.title}
              </h3>
              <p className="text-sm font-light leading-relaxed relative z-10" style={{ color: "var(--lp-text-muted)" }}>
                {f.desc}
              </p>

              {/* Bottom accent bar */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--lp-gold)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
