'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { WeddingData } from "@/lib/types";
import { resolvePhoto } from "@/templates/registry";

const Card = ({ name, parents, image }: { name: string; parents: string; image: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="flex flex-col items-center text-center"
    >
        {/* Frame ornamen foto */}
        <div className="relative mb-8">
            {/* Bingkai batik luar */}
            <div className="absolute -inset-4 rounded-2xl border border-gold/20 rotate-3" />
            <div className="absolute -inset-6 rounded-2xl border border-gold/10 -rotate-2" />

            {/* Ornamen sudut frame */}
            {['-top-3 -left-3', '-top-3 -right-3', '-bottom-3 -left-3', '-bottom-3 -right-3'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-5 h-5`}>
                    <svg viewBox="0 0 16 16" fill="none" className="text-gold opacity-70">
                        <path d="M8 0 L16 8 L8 16 L0 8 Z" fill="currentColor" opacity="0.6" />
                        <path d="M8 3 L13 8 L8 13 L3 8 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
                    </svg>
                </div>
            ))}

            {/* Foto */}
            <div className="relative w-52 h-72 md:w-60 md:h-80 overflow-hidden rounded-xl shadow-2xl"
                style={{ border: '3px solid rgba(198,167,94,0.35)' }}>
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 50vw, 300px"
                        className="object-cover transition-transform duration-1000 hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2"
                        style={{ background: 'var(--jv-bg-alt)' }}>
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gold opacity-30">
                            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="24" cy="18" r="8" fill="currentColor" fillOpacity="0.4" />
                            <path d="M8 42 C8 32 16 26 24 26 C32 26 40 32 40 42" fill="currentColor" fillOpacity="0.2" />
                        </svg>
                        <span className="text-4xl font-script" style={{ color: 'var(--jv-gold)', opacity: 0.4 }}>{name?.[0] ?? '?'}</span>
                    </div>
                )}

                {/* Gradient bawah foto */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
        </div>

        {/* Nama */}
        <span className="jv-names text-3xl md:text-4xl block mb-2">{name}</span>

        {/* Ornamen pemisah */}
        <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-10 opacity-40" style={{ background: 'var(--jv-gold)' }} />
            <div className="w-1 h-1 rounded-full" style={{ background: 'var(--jv-gold)', opacity: 0.5 }} />
            <div className="h-px w-10 opacity-40" style={{ background: 'var(--jv-gold)' }} />
        </div>

        <p className="text-sm leading-relaxed max-w-[200px]" style={{ color: 'var(--jv-text-soft)' }}>
            Putra/i dari<br />
            <span className="font-semibold">{parents}</span>
        </p>
    </motion.div>
);

export default function BrideGroom({ data }: { data: WeddingData }) {
    const photos = (data as any).photos as Record<string, string> ?? {};
    const brideImg = resolvePhoto(photos, 'bride_portrait', data.brideImage);
    const groomImg = resolvePhoto(photos, 'groom_portrait', data.groomImage);

    return (
        <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'var(--jv-cream)' }}>
            {/* Batik background pattern lokal */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="kawung-bg" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                        <ellipse cx="24" cy="12" rx="9" ry="6" fill="none" stroke="#6B4226" strokeWidth="1" />
                        <ellipse cx="24" cy="36" rx="9" ry="6" fill="none" stroke="#6B4226" strokeWidth="1" />
                        <ellipse cx="12" cy="24" rx="6" ry="9" fill="none" stroke="#6B4226" strokeWidth="1" />
                        <ellipse cx="36" cy="24" rx="6" ry="9" fill="none" stroke="#6B4226" strokeWidth="1" />
                        <circle cx="24" cy="24" r="4" fill="none" stroke="#6B4226" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#kawung-bg)" />
            </svg>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Judul section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--jv-gold)', opacity: 0.7 }}>
                        Dengan Penuh Kebahagiaan
                    </p>
                    <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: 'var(--jv-font-serif)', color: 'var(--jv-primary)' }}>
                        Mempelai Berdua
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-20 opacity-40" style={{ background: 'var(--jv-gold)' }} />
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--jv-gold)' }} />
                        <div className="h-px w-20 opacity-40" style={{ background: 'var(--jv-gold)' }} />
                    </div>
                </motion.div>

                {/* Grid mempelai */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-12 md:gap-6 items-center">
                    <Card name={data.groomName} parents={data.groomParents} image={groomImg} />

                    {/* Ornamen tengah & */}
                    <div className="hidden md:flex flex-col items-center justify-center gap-4">
                        <div className="h-16 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
                        <span className="text-5xl font-script" style={{ color: 'var(--jv-gold)' }}>&</span>
                        <div className="h-16 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
                    </div>

                    <Card name={data.brideName} parents={data.brideParents} image={brideImg} />
                </div>
            </div>
        </section>
    );
}
