'use client';

import { motion } from "framer-motion";
import { MailOpen } from "lucide-react";
import { WeddingData } from "@/lib/types";
import Image from "next/image";
import { resolvePhoto } from "@/templates/registry";

interface HeroProps {
    onOpen: () => void;
    guestName?: string;
    data: WeddingData;
}

export default function Hero({ onOpen, guestName, data }: HeroProps) {
    const photos = (data as any).photos as Record<string, string> ?? {};
    const heroImg = resolvePhoto(photos, 'hero_couple', '') || '/images/javanese/Hero.webp';

    const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <motion.section
            initial={{ opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: 'var(--wbg-black-deep)' }}
        >
            {/* Background Couple Cover */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={heroImg}
                    alt="Couple Hero Background"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-top md:object-[center_30%] opacity-40 md:opacity-50"
                    style={{ filter: 'brightness(0.6) contrast(1.1)' }}
                />
                {/* Gradient overlay agar gambar menyatu dengan warna dasar hitam dan teks tetap terbaca jelas */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'linear-gradient(to bottom, var(--wbg-black-deep) 0%, rgba(5,5,5,0.4) 20%, rgba(5,5,5,0.7) 60%, var(--wbg-black-deep) 100%)'
                }} />
            </div>

            {/* Ornamen Sudut Set 6 (Emas Klasik) */}
            <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 pointer-events-none">
                <Image src="/templates/wayang-black-gold/6.1.webp" alt="Corner TL" fill sizes="256px" className="object-contain opacity-80" />
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 pointer-events-none">
                <Image src="/templates/wayang-black-gold/6.2.webp" alt="Corner TR" fill sizes="256px" className="object-contain opacity-80" />
            </div>
            <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 pointer-events-none">
                <Image src="/templates/wayang-black-gold/6.3.webp" alt="Corner BL" fill sizes="256px" className="object-contain opacity-80" />
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 pointer-events-none">
                <Image src="/templates/wayang-black-gold/6.4.webp" alt="Corner BR" fill sizes="256px" className="object-contain opacity-80" />
            </div>

            {/* Batik pattern overlay subtle */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="wbg-parang-hero" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                        <path d="M0 20 Q10 0 20 20 Q30 40 40 20" fill="none" stroke="#C9A84C" strokeWidth="1.2" />
                        <path d="M0 40 Q10 20 20 40" fill="none" stroke="#C9A84C" strokeWidth="0.6" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#wbg-parang-hero)" />
            </svg>

            {/* Inner frame subtle gold line */}
            <div className="absolute inset-8 border border-white/5 pointer-events-none mix-blend-overlay" style={{ borderColor: 'var(--wbg-border-gold)' }} />

            {/* Konten utama */}
            <motion.div
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.4, ease: "easeOut" }}
                className="relative z-10 text-center px-6 max-w-lg"
            >
                {/* Label atas */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center gap-3 mb-5"
                >
                    <div className="h-px w-12" style={{ background: 'var(--wbg-gold)', opacity: 0.4 }} />
                    <svg width="10" height="10" viewBox="0 0 10 10" style={{ fill: 'var(--wbg-gold)', opacity: 0.6 }}>
                        <path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z" />
                    </svg>
                    <div className="h-px w-12" style={{ background: 'var(--wbg-gold)', opacity: 0.4 }} />
                </motion.div>

                <p className="wbg-label mb-5">Undangan Pernikahan</p>

                {/* Nama mempelai */}
                <h1
                    className="text-5xl md:text-7xl lg:text-8xl font-script mb-1 leading-tight wbg-shimmer-text"
                    style={{ fontFamily: 'var(--wbg-font-script)', filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.8))' }}
                >
                    {data.groomShort}
                </h1>
                <p className="text-2xl md:text-4xl font-script mb-1" style={{ color: 'var(--wbg-gold)', opacity: 0.6, fontFamily: 'var(--wbg-font-script)', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>&</p>
                <h1
                    className="text-5xl md:text-7xl lg:text-8xl font-script mb-6 leading-tight wbg-shimmer-text"
                    style={{ fontFamily: 'var(--wbg-font-script)', filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.8))' }}
                >
                    {data.brideShort}
                </h1>

                {/* Tanggal */}
                <div className="flex items-center justify-center gap-3 mb-7">
                    <div className="h-px w-10" style={{ background: 'var(--wbg-gold)', opacity: 0.3 }} />
                    <span className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--wbg-text-dim)' }}>{formattedDate}</span>
                    <div className="h-px w-10" style={{ background: 'var(--wbg-gold)', opacity: 0.3 }} />
                </div>

                {/* Nama tamu */}
                {guestName && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                        className="mb-8 py-4 px-6 rounded-xl"
                        style={{ border: '1px solid var(--wbg-border-gold)', background: 'rgba(201,168,76,0.05)' }}
                    >
                        <p className="text-xs mb-1 uppercase tracking-widest" style={{ color: 'var(--wbg-text-dim)' }}>Kepada Yth.</p>
                        <h2 className="text-xl" style={{ fontFamily: 'var(--wbg-font-body)', color: 'var(--wbg-cream)' }}>{guestName}</h2>
                    </motion.div>
                )}

                {/* Tombol buka */}
                <motion.button
                    onClick={onOpen}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="wbg-btn wbg-btn-filled inline-flex items-center gap-3 px-10 py-4"
                >
                    <MailOpen className="w-4 h-4" />
                    Buka Undangan
                </motion.button>
            </motion.div>

            {/* Aksara Jawa watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.02 }}>
                <span className="text-[8rem] md:text-[14rem]" style={{ fontFamily: 'var(--wbg-font-script)', color: 'var(--wbg-gold)' }}>ꦱꦸꦏ</span>
            </div>
        </motion.section>
    );
}
