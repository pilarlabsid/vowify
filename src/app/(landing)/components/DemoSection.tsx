"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MailOpen, MapPin, Calendar, Heart } from "lucide-react";

export default function DemoSection() {
  const [step, setStep] = useState(0);

  // Auto-cycle through simulation steps
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 4000); // 4 seconds per step
    return () => clearInterval(timer);
  }, []);

  const stepsContent = [
    {
      icon: <MailOpen className="w-6 h-6" />,
      title: "Opening Screen",
      desc: "Menyambut tamu dengan sampul digital yang elegan dan animasi pembukaan amplop."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Kisah Pasangan",
      desc: "Menampilkan inisial, nama lengkap, dan cerita perjalanan cinta yang menyentuh hati."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Detail & Waktu",
      desc: "Menginformasikan kapan hari bahagia akan dilaksanakan dengan jelas dan indah."
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Lokasi & Navigasi",
      desc: "Memudahkan tamu mencapai lokasi acara melalui integrasi peta interaktif."
    }
  ];

  return (
    <section id="demo" className="py-12 relative overflow-hidden" style={{ background: "var(--lp-bg)" }}>
      {/* Soft background decor */}
      <div className="absolute top-10 right-0 w-96 h-96 rounded-full opacity-40 mix-blend-multiply" style={{ background: "radial-gradient(circle, var(--lp-gold-dim) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute bottom-10 left-0 w-96 h-96 rounded-full opacity-30 mix-blend-multiply" style={{ background: "radial-gradient(circle, var(--lp-blush) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full relative z-10">
        
        {/* Left text guide */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: "var(--lp-gold)" }}>
            Simulasi Langsung
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight mb-4" style={{ color: "var(--lp-cream)" }}>
            Pengalaman <span style={{ color: "var(--lp-gold)", fontStyle: "italic" }}>Imersif</span> Membuka Undangan
          </h2>
          <p className="text-base font-light leading-relaxed mb-8 opacity-80" style={{ color: "var(--lp-text-muted)" }}>
            Bukan sekadar gambar statis. Vowify menghidupkan setiap guliran layar dengan
            animasi mikro yang disusun cermat untuk memukau setiap tamu Anda.
          </p>

          <div className="flex flex-col gap-3">
            {stepsContent.map((s, i) => (
              <motion.div 
                key={i} 
                className="group flex items-center gap-4 py-3.5 px-6 rounded-[1.5rem] cursor-pointer relative overflow-hidden"
                onClick={() => setStep(i)}
                initial={false}
                animate={{
                  scale: step === i ? 1.02 : 1,
                  x: step === i ? 12 : 0,
                  backgroundColor: step === i 
                    ? "rgba(255, 251, 245, 1)" 
                    : "rgba(255, 255, 255, 0.35)",
                  borderColor: step === i 
                    ? "var(--lp-gold)" 
                    : "rgba(168, 129, 50, 0.12)",
                  boxShadow: step === i 
                    ? "0 25px 50px -15px rgba(168, 129, 50, 0.3)" 
                    : "0 10px 30px -15px rgba(0,0,0,0.05)",
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ 
                  backdropFilter: "blur(12px)",
                  border: "1px solid",
                }}
                whileHover={{ 
                  backgroundColor: step === i ? "rgba(255, 251, 245, 1)" : "rgba(255, 255, 255, 0.6)",
                  borderColor: "var(--lp-gold-light)",
                }}
              >
                {/* Active Indicator Line */}
                <motion.div 
                  initial={false}
                  animate={{ 
                    scaleY: step === i ? 1 : 0, 
                    opacity: step === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 top-0 bottom-0 w-[5px] bg-[var(--lp-gold)]"
                  style={{ 
                    borderRadius: "0 4px 4px 0",
                    boxShadow: "2px 0 15px rgba(168, 129, 50, 0.5)",
                    originY: 0.5
                  }}
                />

                <motion.div 
                  animate={{ 
                    background: step === i 
                      ? "linear-gradient(135deg, var(--lp-gold) 0%, var(--lp-gold-light) 100%)" 
                      : "linear-gradient(135deg, white 0%, var(--lp-gold-dim) 100%)",
                    color: step === i ? "#FFFFFF" : "var(--lp-gold)",
                    boxShadow: step === i 
                      ? "0 10px 20px -5px rgba(168, 129, 50, 0.3)" 
                      : "0 4px 10px -2px rgba(168, 129, 50, 0.05)",
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                >
                  <div className="transition-transform duration-500 group-hover:scale-110">{s.icon}</div>
                </motion.div>
                <div>
                  <h3 className="font-serif font-bold text-base mb-0.5 transition-colors duration-500" style={{ color: step === i ? "var(--lp-gold)" : "var(--lp-cream)" }}>
                    {s.title}
                  </h3>
                  <p className="text-xs font-light leading-relaxed max-w-sm transition-opacity duration-500" style={{ color: "var(--lp-text-muted)", opacity: step === i ? 1 : 0.7 }}>
                    {s.desc}
                  </p>
                </div>

                {/* Subtle active glow */}
                <motion.div 
                  initial={false}
                  animate={{ 
                    opacity: step === i ? 0.08 : 0,
                    scale: step === i ? 1 : 0.8
                  }}
                  className="absolute -top-16 -right-16 w-32 h-32 bg-[var(--lp-gold)] rounded-full blur-2xl pointer-events-none" 
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Phone Mockup - Simulation */}
        <motion.div 
          className="relative flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Mockup Frame */}
          <div 
            className="w-64 sm:w-72 lg:w-80 h-[520px] sm:h-[580px] lg:h-[640px] rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden relative shadow-2xl bg-white transition-all duration-700"
            style={{ border: "10px solid #3A3A3A", boxShadow: "0 25px 50px rgba(58,58,58,0.15)" }}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-32 lg:w-36 h-5 sm:h-6 bg-[#3A3A3A] rounded-b-xl z-50" />

            {/* Screen Content - Driven by `step` state */}
            <div className="absolute inset-0 bg-stone-50 overflow-hidden">
              
              {/* Step 0: Cover */}
              {step === 0 && (
                <motion.div 
                  className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 p-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                >
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                    className="w-20 h-20 mb-6 rounded-full mx-auto" style={{ background: "var(--lp-gold-dim)", color: "var(--lp-gold)" }}
                  >
                    <MailOpen className="w-10 h-10 m-5" />
                  </motion.div>
                  <motion.h4 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="font-serif text-2xl mb-2 text-stone-800">
                    Undangan Pernikahan
                  </motion.h4>
                  <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="text-sm text-stone-500 mb-8">
                    Kepada Yth. <br/><strong className="text-stone-700">Bapak/Ibu Tamu</strong>
                  </motion.p>
                  <motion.button 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}
                    className="px-6 py-2 rounded-full text-white text-xs font-bold" style={{ background: "var(--lp-gold)" }}
                  >
                    Buka Undangan
                  </motion.button>
                </motion.div>
              )}

              {/* Step 1: Names */}
              {step === 1 && (
                <motion.div 
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className="absolute inset-x-0 top-0 h-40 opacity-20"
                    style={{ background: "linear-gradient(to bottom, var(--lp-gold), transparent)" }}
                  />
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="text-5xl mb-4 font-serif text-stone-800">A <span className="text-3xl text-stone-400 mx-2">&</span> S</motion.span>
                  <motion.h4 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="font-serif text-4xl mb-2" style={{ color: "var(--lp-gold)" }}>Andi & Sari</motion.h4>
                  <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="text-xs text-stone-500 mt-4 leading-relaxed">
                    &quot;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...&quot;
                  </motion.p>
                </motion.div>
              )}

              {/* Step 2: Date */}
              {step === 2 && (
                <motion.div 
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="border-y-2 border-stone-300 py-6 px-10">
                    <h5 className="text-sm uppercase tracking-widest text-stone-500 mb-2">Save The Date</h5>
                    <h4 className="font-serif text-3xl text-stone-800 mb-2">14 . 02 . 2025</h4>
                    <p className="text-xs font-bold" style={{ color: "var(--lp-gold)" }}>Minggu, Pukul 10.00 WIB</p>
                  </motion.div>
                  
                  <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 flex gap-4">
                     <div className="bg-white p-3 shadow-sm rounded-lg text-center w-14">
                        <span className="block font-bold text-lg text-stone-800">12</span>
                        <span className="block text-[10px] text-stone-400">Hari</span>
                     </div>
                     <div className="bg-white p-3 shadow-sm rounded-lg text-center w-14">
                        <span className="block font-bold text-lg text-stone-800">08</span>
                        <span className="block text-[10px] text-stone-400">Jam</span>
                     </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 3: Location */}
              {step === 3 && (
                <motion.div 
                  className="absolute inset-0 flex flex-col items-center justify-end pb-12 p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    initial={{ y: -50, scale: 0.8 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.6 }}
                    className="absolute inset-x-0 top-0 h-1/2 bg-stone-200" 
                  >
                    {/* Fake Map */}
                    <div className="w-full h-full opacity-30 bg-[url('/images/mockup-phone.webp')] bg-cover bg-center" />
                    <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                       <MapPin className="w-5 h-5 text-red-500" />
                    </div>
                  </motion.div>
                  
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="relative z-10 bg-white p-6 rounded-2xl shadow-xl mt-40 mx-4">
                    <h4 className="font-serif text-xl text-stone-800 mb-1">Grand Ballroom</h4>
                    <p className="text-xs text-stone-500 mb-4 leading-relaxed">Jl. Sudirman No. 123, Jakarta Selatan</p>
                    <button className="w-full py-2.5 rounded-xl text-white text-xs font-bold ring-1 ring-black/5" style={{ background: "var(--lp-gold)" }}>
                      Buka di Google Maps
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Subtle reflection under phone */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-12 bg-black opacity-10 blur-xl rounded-full" />
        </motion.div>

      </div>
    </section>
  );
}
