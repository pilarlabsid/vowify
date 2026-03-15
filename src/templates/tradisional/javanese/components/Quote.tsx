'use client';

import { motion } from "framer-motion";

export default function Quote() {
    return (
        <section className="py-20 px-6 relative overflow-hidden" style={{ background: 'var(--jv-cream)' }}>
            {/* ── Batik pattern SVG lokal ── */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="parang-quote" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <line x1="0" y1="15" x2="30" y2="15" stroke="#6B4226" strokeWidth="1" />
                        <line x1="0" y1="5" x2="30" y2="5" stroke="#6B4226" strokeWidth="0.4" />
                        <line x1="0" y1="25" x2="30" y2="25" stroke="#6B4226" strokeWidth="0.4" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#parang-quote)" />
            </svg>

            {/* ── Ornamen kiri & kanan ── */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
                <svg width="24" height="120" viewBox="0 0 24 120" fill="none" className="text-sogan">
                    {[0, 20, 40, 60, 80, 100].map(y => (
                        <ellipse key={y} cx="12" cy={y + 10} rx="8" ry="5" fill="none" stroke="currentColor" strokeWidth="1" />
                    ))}
                </svg>
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
                <svg width="24" height="120" viewBox="0 0 24 120" fill="none" className="text-sogan">
                    {[0, 20, 40, 60, 80, 100].map(y => (
                        <ellipse key={y} cx="12" cy={y + 10} rx="8" ry="5" fill="none" stroke="currentColor" strokeWidth="1" />
                    ))}
                </svg>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="max-w-2xl mx-auto text-center relative z-10"
            >
                {/* Ornamen atas */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-px flex-1 max-w-[80px]" style={{ background: 'var(--jv-gold)' }} />
                    <svg width="20" height="20" viewBox="0 0 20 20" className="text-gold">
                        <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="currentColor" fillOpacity="0.7" />
                    </svg>
                    <div className="h-px flex-1 max-w-[80px]" style={{ background: 'var(--jv-gold)' }} />
                </div>

                <span className="text-gold text-4xl md:text-5xl font-script block mb-6" style={{ lineHeight: 1.4 }}>
                    بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                </span>

                <div className="relative px-8 md:px-12">
                    {/* Tanda kutip ornamen */}
                    <svg className="absolute -top-2 -left-2 w-8 h-8 opacity-30" viewBox="0 0 32 32" fill="currentColor" style={{ color: 'var(--jv-gold)' }}>
                        <path d="M0 22 C0 12 6 4 14 0 L16 4 C10 7 7 12 8 18 C10 18 12 19 13 21 C14 23 13 26 11 27 C9 28 7 28 5 27 C2 26 0 24 0 22Z" />
                        <path d="M16 22 C16 12 22 4 30 0 L32 4 C26 7 23 12 24 18 C26 18 28 19 29 21 C30 23 29 26 27 27 C25 28 23 28 21 27 C18 26 16 24 16 22Z" />
                    </svg>

                    <p className="text-base md:text-lg font-body leading-loose italic"
                        style={{ color: 'var(--jv-primary)', opacity: 0.85 }}>
                        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan
                        untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya,
                        dan Dia menjadikan di antaramu rasa kasih dan sayang."
                    </p>
                </div>

                <div className="flex items-center justify-center gap-3 my-6">
                    <div className="h-px w-8 opacity-30" style={{ background: 'var(--jv-gold)' }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--jv-gold)' }} />
                    <div className="h-px w-8 opacity-30" style={{ background: 'var(--jv-gold)' }} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--jv-gold)' }}>
                    (QS. Ar-Rum: 21)
                </p>

                {/* Ornamen bawah */}
                <div className="flex items-center justify-center gap-3 mt-8">
                    <div className="h-px flex-1 max-w-[80px]" style={{ background: 'var(--jv-gold)', opacity: 0.4 }} />
                    <svg width="14" height="14" viewBox="0 0 14 14" className="text-gold opacity-40">
                        <path d="M7 0 L8 6 L14 7 L8 8 L7 14 L6 8 L0 7 L6 6 Z" fill="currentColor" />
                    </svg>
                    <div className="h-px flex-1 max-w-[80px]" style={{ background: 'var(--jv-gold)', opacity: 0.4 }} />
                </div>
            </motion.div>
        </section>
    );
}
