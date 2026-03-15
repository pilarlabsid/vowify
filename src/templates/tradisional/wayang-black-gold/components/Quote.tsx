'use client';

import { motion } from "framer-motion";
import Image from "next/image";

export default function Quote() {
    return (
        <section
            className="py-20 px-6 relative overflow-hidden"
            style={{ background: 'var(--wbg-black-soft)' }}
        >
            {/* Background Asset 3.1 — dahan vertikal kiri */}
            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 pointer-events-none overflow-hidden">
                <Image
                    src="/templates/wayang-black-gold/3.1.webp"
                    alt="Ornament Left"
                    fill
                    sizes="192px"
                    className="object-contain object-left opacity-25"
                    style={{ filter: 'sepia(1) saturate(0.5) brightness(0.6) hue-rotate(20deg)' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, var(--wbg-black-soft))' }} />
            </div>

            {/* Background Asset 3.2 — dahan vertikal kanan */}
            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 pointer-events-none overflow-hidden">
                <Image
                    src="/templates/wayang-black-gold/3.2.webp"
                    alt="Ornament Right"
                    fill
                    sizes="192px"
                    className="object-contain object-right opacity-25"
                    style={{ filter: 'sepia(1) saturate(0.5) brightness(0.6) hue-rotate(20deg)' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, transparent, var(--wbg-black-soft))' }} />
            </div>

            {/* Batik kawung pattern lokal */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="wbg-kawung-quote" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                        <ellipse cx="25" cy="12.5" rx="9" ry="6" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
                        <ellipse cx="25" cy="37.5" rx="9" ry="6" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
                        <ellipse cx="12.5" cy="25" rx="6" ry="9" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
                        <ellipse cx="37.5" cy="25" rx="6" ry="9" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
                        <circle cx="25" cy="25" r="4" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#wbg-kawung-quote)" />
            </svg>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="max-w-2xl mx-auto text-center relative z-10"
            >
                {/* Ornamen atas */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-px flex-1 max-w-[80px]" style={{ background: 'var(--wbg-gold)', opacity: 0.4 }} />
                    <svg width="22" height="22" viewBox="0 0 22 22" style={{ fill: 'var(--wbg-gold)' }}>
                        <path d="M11 0L13 9L22 11L13 13L11 22L9 13L0 11L9 9Z" fillOpacity="0.7" />
                    </svg>
                    <div className="h-px flex-1 max-w-[80px]" style={{ background: 'var(--wbg-gold)', opacity: 0.4 }} />
                </div>

                {/* Bismillah */}
                <span
                    className="text-4xl md:text-5xl block mb-7"
                    style={{
                        fontFamily: 'var(--wbg-font-script)',
                        color: 'var(--wbg-gold)',
                        lineHeight: 1.5
                    }}
                >
                    بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                </span>

                {/* Ayat */}
                <div className="relative px-8 md:px-12">
                    <svg className="absolute -top-2 -left-2 w-8 h-8 opacity-25" viewBox="0 0 32 32" fill="currentColor" style={{ color: 'var(--wbg-gold)' }}>
                        <path d="M0 22 C0 12 6 4 14 0 L16 4 C10 7 7 12 8 18 C10 18 12 19 13 21 C14 23 13 26 11 27 C9 28 7 28 5 27 C2 26 0 24 0 22Z" />
                        <path d="M16 22 C16 12 22 4 30 0 L32 4 C26 7 23 12 24 18 C26 18 28 19 29 21 C30 23 29 26 27 27 C25 28 23 28 21 27 C18 26 16 24 16 22Z" />
                    </svg>
                    <p
                        className="text-base md:text-lg leading-loose italic"
                        style={{ color: 'var(--wbg-text-light)', opacity: 0.85, fontFamily: 'var(--wbg-font-body)' }}
                    >
                        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan
                        untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya,
                        dan Dia menjadikan di antaramu rasa kasih dan sayang."
                    </p>
                </div>

                <div className="flex items-center justify-center gap-3 my-6">
                    <div className="h-px w-8 opacity-30" style={{ background: 'var(--wbg-gold)' }} />
                    <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ background: 'var(--wbg-gold)' }} />
                    <div className="h-px w-8 opacity-30" style={{ background: 'var(--wbg-gold)' }} />
                </div>

                <p className="wbg-label">(QS. Ar-Rum: 21)</p>

                {/* Ornamen bawah */}
                <div className="flex items-center justify-center gap-3 mt-8">
                    <div className="h-px flex-1 max-w-[60px]" style={{ background: 'var(--wbg-gold)', opacity: 0.3 }} />
                    <svg width="12" height="12" viewBox="0 0 12 12" style={{ fill: 'var(--wbg-gold)', opacity: 0.35 }}>
                        <path d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5Z" />
                    </svg>
                    <div className="h-px flex-1 max-w-[60px]" style={{ background: 'var(--wbg-gold)', opacity: 0.3 }} />
                </div>
            </motion.div>
        </section>
    );
}
