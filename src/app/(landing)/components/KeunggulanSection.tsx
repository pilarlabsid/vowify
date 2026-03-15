"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { FEATURES_PRIMARY } from "./data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
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

export default function KeunggulanSection() {
  return (
    <section id="keunggulan" className="py-16 sm:py-20 relative overflow-hidden scroll-mt-20" style={{ background: "var(--lp-bg)" }}>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: "var(--lp-gold)" }}>
            Mengapa Vowify?
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6" style={{ color: "var(--lp-cream)" }}>
            Cara Modern & Elegan <br className="hidden sm:block" />
            <span style={{ color: "var(--lp-gold)", fontStyle: "italic" }}>Mengundang Tamu Anda</span>
          </h2>
          <p className="max-w-xl mx-auto text-lg font-light leading-relaxed" style={{ color: "var(--lp-text-muted)" }}>
            Vowify hadir untuk membuat hari bahagia Anda semakin berkesan dengan
            teknologi undangan digital yang memukau secara visual.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {FEATURES_PRIMARY.map((f, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                borderColor: "rgba(168, 129, 50, 0.3)",
                boxShadow: "0 30px 60px -15px rgba(168, 129, 50, 0.1)",
                transition: { duration: 0.4 }
              }}
              className="group p-8 rounded-[2.5rem] relative overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(168, 129, 50, 0.1)",
              }}
            >
              {/* Decorative Glow */}
              <div 
                className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--lp-gold)] opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-700"
              />
              
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-transform duration-700 group-hover:scale-110"
                style={{ 
                  background: "linear-gradient(135deg, white 0%, var(--lp-gold-dim) 100%)", 
                  color: "var(--lp-gold)",
                  boxShadow: "0 8px 16px -4px rgba(168, 129, 50, 0.1)"
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
            </motion.div>
          ))}

          {/* Stat card - Enhanced Glassmorphism */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, var(--lp-gold-dim) 0%, rgba(255,255,255,0.4) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(168, 129, 50, 0.2)",
              boxShadow: "0 20px 40px -10px rgba(168, 129, 50, 0.1)",
            }}
          >
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700" style={{ background: "radial-gradient(circle at center, var(--lp-gold), transparent)" }} />
            
            <motion.div 
               initial={{ scale: 0.9 }}
               whileInView={{ scale: 1 }}
               className="relative z-10"
            >
              <p className="text-5xl font-serif font-bold mb-2" style={{ color: "var(--lp-gold)", filter: "drop-shadow(0 4px 12px rgba(168,129,50,0.2))" }}>2.000+</p>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--lp-text-muted)" }}>
                Happy Couples
              </p>
            </motion.div>

            <div className="flex gap-1.5 relative z-10 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
              ))}
            </div>
            
            <p className="text-[10px] font-medium opacity-60 italic" style={{ color: "var(--lp-text-muted)" }}>
              &quot;Momen indah yang abadi&quot;
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
