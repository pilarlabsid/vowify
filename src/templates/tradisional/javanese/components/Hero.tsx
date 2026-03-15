'use client';

import { motion } from "framer-motion";
import { MailOpen } from "lucide-react";
import { WeddingData } from "@/lib/types";
import WayangSilhouette from "./WayangSilhouette";

interface HeroProps {
    onOpen: () => void;
    guestName?: string;
    data: WeddingData;
}

export default function Hero({ onOpen, guestName, data }: HeroProps) {
    const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <motion.section
            initial={{ opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: 'var(--jv-bg-dark)' }}
        >
            {/* ── Local SVG Batik Pattern (tidak butuh CDN) ── */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="kawung-hero" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <ellipse cx="20" cy="10" rx="8" ry="5" fill="none" stroke="#C6A75E" strokeWidth="0.8" />
                        <ellipse cx="20" cy="30" rx="8" ry="5" fill="none" stroke="#C6A75E" strokeWidth="0.8" />
                        <ellipse cx="10" cy="20" rx="5" ry="8" fill="none" stroke="#C6A75E" strokeWidth="0.8" />
                        <ellipse cx="30" cy="20" rx="5" ry="8" fill="none" stroke="#C6A75E" strokeWidth="0.8" />
                        <circle cx="20" cy="20" r="3" fill="none" stroke="#C6A75E" strokeWidth="0.8" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#kawung-hero)" />
            </svg>

            {/* ── Ornamen sudut emas ── */}
            <div className="absolute top-6 left-6 w-20 h-20 md:w-32 md:h-32 border-l-[1.5px] border-t-[1.5px] border-gold/40 rounded-tl-2xl" />
            <div className="absolute top-6 right-6 w-20 h-20 md:w-32 md:h-32 border-r-[1.5px] border-t-[1.5px] border-gold/40 rounded-tr-2xl" />
            <div className="absolute bottom-6 left-6 w-20 h-20 md:w-32 md:h-32 border-l-[1.5px] border-b-[1.5px] border-gold/40 rounded-bl-2xl" />
            <div className="absolute bottom-6 right-6 w-20 h-20 md:w-32 md:h-32 border-r-[1.5px] border-b-[1.5px] border-gold/40 rounded-br-2xl" />

            {/* Ornamen sudut dalam */}
            <div className="absolute top-10 left-10 w-10 h-10 border-l border-t border-gold/20 rounded-tl-xl" />
            <div className="absolute top-10 right-10 w-10 h-10 border-r border-t border-gold/20 rounded-tr-xl" />
            <div className="absolute bottom-10 left-10 w-10 h-10 border-l border-b border-gold/20 rounded-bl-xl" />
            <div className="absolute bottom-10 right-10 w-10 h-10 border-r border-b border-gold/20 rounded-br-xl" />

            {/* ── Wayang Silhouette kiri & kanan ── */}
            <div className="absolute left-0 bottom-0 hidden md:block">
                <WayangSilhouette side="left" className="text-gold" />
            </div>
            <div className="absolute right-0 bottom-0 hidden md:block">
                <WayangSilhouette side="right" className="text-gold" />
            </div>

            {/* ── Konten utama ── */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                className="relative z-10 text-center px-6 max-w-lg"
            >
                {/* Ornamen atas tengah */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
                    <div className="w-2 h-2 rotate-45 border border-gold/60" />
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
                </div>

                <p className="text-gold/70 tracking-[0.25em] mb-4 uppercase text-xs font-light">
                    Undangan Pernikahan
                </p>

                <h1 className="text-5xl md:text-7xl font-script mb-2 leading-tight"
                    style={{ color: 'var(--jv-gold)' }}>
                    {data.groomShort}
                </h1>
                <p className="text-gold/50 text-2xl font-script mb-2">&</p>
                <h1 className="text-5xl md:text-7xl font-script mb-6 leading-tight"
                    style={{ color: 'var(--jv-gold)' }}>
                    {data.brideShort}
                </h1>

                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
                    <span className="text-gold/60 text-xs tracking-widest">{formattedDate}</span>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
                </div>

                {guestName && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="mb-8 py-4 px-6 border border-gold/20 rounded-xl"
                        style={{ background: 'rgba(198,167,94,0.06)' }}
                    >
                        <p className="text-cream/50 text-xs mb-1 uppercase tracking-widest">Kepada Yth.</p>
                        <h2 className="text-xl font-serif" style={{ color: 'var(--jv-cream)' }}>{guestName}</h2>
                    </motion.div>
                )}

                <motion.button
                    onClick={onOpen}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="jv-btn group inline-flex items-center gap-3 px-8 py-4 text-sm"
                >
                    <MailOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Buka Undangan
                </motion.button>
            </motion.div>

            {/* ── Aksara Jawa watermark ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] select-none">
                <span className="text-gold font-script text-[12rem] leading-none">ꦱꦸꦏ</span>
            </div>
        </motion.section>
    );
}
