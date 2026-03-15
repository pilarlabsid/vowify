'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { WeddingData } from "@/lib/types";
import { resolvePhoto } from "@/templates/registry";

const Card = ({ name, parents, image, role }: { name: string; parents: string; image: string; role: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="flex flex-col items-center text-center"
    >
        {/* Frame foto */}
        <div className="relative mb-8">
            {/* Bingkai luar berputar */}
            <div
                className="absolute -inset-5 rounded-2xl rotate-2 opacity-30"
                style={{ border: '1px solid var(--wbg-gold)' }}
            />
            <div
                className="absolute -inset-8 rounded-3xl -rotate-1 opacity-15"
                style={{ border: '1px solid var(--wbg-gold)' }}
            />

            {/* Diamond ornamen pojok */}
            {['-top-4 -left-4', '-top-4 -right-4', '-bottom-4 -left-4', '-bottom-4 -right-4'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-4 h-4`}>
                    <svg viewBox="0 0 14 14" fill="none" style={{ color: 'var(--wbg-gold)' }}>
                        <path d="M7 0 L14 7 L7 14 L0 7 Z" fill="currentColor" fillOpacity="0.6" />
                        <path d="M7 3 L11 7 L7 11 L3 7 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
                    </svg>
                </div>
            ))}

            {/* Foto container */}
            <div
                className="relative w-52 h-72 md:w-60 md:h-80 overflow-hidden rounded-xl shadow-2xl"
                style={{ border: '2px solid rgba(201,168,76,0.4)', boxShadow: 'var(--wbg-shadow-gold), inset 0 0 20px rgba(0,0,0,0.3)' }}
            >
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 50vw, 300px"
                        className="object-cover transition-transform duration-1000 hover:scale-110"
                    />
                ) : (
                    <div
                        className="w-full h-full flex flex-col items-center justify-center gap-3"
                        style={{ background: 'var(--wbg-black-soft)' }}
                    >
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ color: 'var(--wbg-gold)', opacity: 0.25 }}>
                            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="24" cy="18" r="8" fill="currentColor" fillOpacity="0.4" />
                            <path d="M8 42 C8 32 16 26 24 26 C32 26 40 32 40 42" fill="currentColor" fillOpacity="0.2" />
                        </svg>
                        <span
                            className="text-4xl"
                            style={{ fontFamily: 'var(--wbg-font-script)', color: 'var(--wbg-gold)', opacity: 0.35 }}
                        >
                            {name?.[0] ?? '?'}
                        </span>
                    </div>
                )}

                {/* Gold shimmer overlay bawah */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
                    background: 'linear-gradient(to top, rgba(201,168,76,0.12), transparent)'
                }} />
            </div>
        </div>

        {/* Role label */}
        <p className="wbg-label mb-2" style={{ letterSpacing: '0.2em' }}>{role}</p>

        {/* Nama */}
        <span
            className="wbg-names text-3xl md:text-4xl block mb-3"
            style={{ fontFamily: 'var(--wbg-font-script)', color: 'var(--wbg-gold)' }}
        >
            {name}
        </span>

        {/* Ornamen pemisah */}
        <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-8 opacity-35" style={{ background: 'var(--wbg-gold)' }} />
            <div className="w-1 h-1 rounded-full opacity-5" style={{ background: 'var(--wbg-gold)' }} />
            <div className="h-px w-8 opacity-35" style={{ background: 'var(--wbg-gold)' }} />
        </div>

        <p className="text-sm leading-relaxed max-w-[200px]" style={{ color: 'var(--wbg-text-dim)' }}>
            Putra/i dari<br />
            <span className="font-semibold" style={{ color: 'var(--wbg-text-light)' }}>{parents}</span>
        </p>
    </motion.div>
);

export default function BrideGroom({ data }: { data: WeddingData }) {
    const photos = (data as any).photos as Record<string, string> ?? {};
    const brideImg = resolvePhoto(photos, 'bride_portrait', data.brideImage) || '/images/javanese/bride.webp';
    const groomImg = resolvePhoto(photos, 'groom_portrait', data.groomImage) || '/images/javanese/groom.webp';

    return (
        <section
            className="py-24 px-6 relative overflow-hidden"
            style={{ background: 'var(--wbg-black)' }}
        >
            {/* Asset 4 — background wayang center */}
            <div className="absolute inset-0 pointer-events-none">
                <Image
                    src="/templates/wayang-black-gold/4.webp"
                    alt="Wayang Background"
                    fill
                    sizes="100vw"
                    className="object-cover object-center opacity-8"
                    style={{ filter: 'sepia(1) saturate(0.3) brightness(0.25)', opacity: 0.08 }}
                />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 10%, var(--wbg-black) 70%)' }} />
            </div>

            {/* Kawung batik lokal */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="wbg-kawung-bg" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                        <ellipse cx="25" cy="12" rx="10" ry="7" fill="none" stroke="#C9A84C" strokeWidth="1" />
                        <ellipse cx="25" cy="38" rx="10" ry="7" fill="none" stroke="#C9A84C" strokeWidth="1" />
                        <ellipse cx="12" cy="25" rx="7" ry="10" fill="none" stroke="#C9A84C" strokeWidth="1" />
                        <ellipse cx="38" cy="25" rx="7" ry="10" fill="none" stroke="#C9A84C" strokeWidth="1" />
                        <circle cx="25" cy="25" r="4" fill="none" stroke="#C9A84C" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#wbg-kawung-bg)" />
            </svg>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Judul */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="wbg-label mb-3">Dengan Penuh Kebahagiaan</p>
                    <h2
                        className="text-3xl md:text-4xl mb-4"
                        style={{ fontFamily: 'var(--wbg-font-display)', color: 'var(--wbg-gold)' }}
                    >
                        Mempelai Berdua
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-20 opacity-30" style={{ background: 'var(--wbg-gold)' }} />
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--wbg-gold)' }} />
                        <div className="h-px w-20 opacity-30" style={{ background: 'var(--wbg-gold)' }} />
                    </div>
                </motion.div>

                {/* Grid mempelai */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-6 items-center">
                    <Card
                        name={data.groomName}
                        parents={data.groomParents}
                        image={groomImg}
                        role="Mempelai Pria"
                    />

                    {/* Ornamen tengah */}
                    <div className="hidden md:flex flex-col items-center justify-center gap-4">
                        <div className="h-16 w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4), transparent)' }} />
                        <span
                            className="text-5xl wbg-shimmer-text"
                            style={{ fontFamily: 'var(--wbg-font-script)' }}
                        >
                            &
                        </span>
                        <div className="h-16 w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4), transparent)' }} />
                    </div>

                    {/* Mobile & separator */}
                    <div className="flex md:hidden justify-center py-4">
                        <span
                            className="text-4xl"
                            style={{ fontFamily: 'var(--wbg-font-script)', color: 'var(--wbg-gold)', opacity: 0.5 }}
                        >
                            &
                        </span>
                    </div>

                    <Card
                        name={data.brideName}
                        parents={data.brideParents}
                        image={brideImg}
                        role="Mempelai Wanita"
                    />
                </div>
            </div>
        </section>
    );
}
