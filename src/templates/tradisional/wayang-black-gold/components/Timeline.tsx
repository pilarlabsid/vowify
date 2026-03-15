'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { WeddingData } from "@/lib/types";

const events = [
    { icon: '♥', label: 'Pertama Bertemu', desc: 'Awal dari segalanya' },
    { icon: '🌸', label: 'Menjalin Hubungan', desc: 'Bersama dalam suka dan duka' },
    { icon: '💍', label: 'Lamaran', desc: 'Janji setia untuk selamanya' },
    { icon: '👑', label: 'Hari Pernikahan', desc: 'Menyatukan hati kami' },
];

// Asset 8.x — ornamen kecil untuk timeline
const TIMELINE_ASSETS = [
    '/templates/wayang-black-gold/8.1.webp',
    '/templates/wayang-black-gold/8.2.webp',
    '/templates/wayang-black-gold/8.3.webp',
    '/templates/wayang-black-gold/8.4.webp',
];

export default function Timeline({ data }: { data: WeddingData }) {
    return (
        <section
            className="py-24 px-6 relative overflow-hidden"
            style={{ background: 'var(--wbg-black-soft)' }}
        >
            {/* Dekorasi asset 8.x di corner */}
            {TIMELINE_ASSETS.slice(0, 2).map((src, i) => (
                <div
                    key={i}
                    className={`absolute ${i === 0 ? 'top-8 left-8' : 'top-8 right-8'} w-20 h-20 pointer-events-none`}
                    style={{ opacity: 0.12 }}
                >
                    <Image
                        src={src}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-contain"
                        style={{ filter: 'sepia(1) saturate(0.3) brightness(0.5) hue-rotate(20deg)' }}
                    />
                </div>
            ))}

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Judul */}
                <div className="text-center mb-16">
                    <p className="wbg-label mb-3">Kisah Cinta Kami</p>
                    <h2
                        className="text-3xl md:text-4xl"
                        style={{ fontFamily: 'var(--wbg-font-display)', color: 'var(--wbg-gold)' }}
                    >
                        Perjalanan Cinta
                    </h2>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Garis tengah */}
                    <div
                        className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px"
                        style={{ background: 'linear-gradient(to bottom, transparent, var(--wbg-gold) 20%, var(--wbg-gold) 80%, transparent)' }}
                    />

                    <div className="space-y-12">
                        {events.map((ev, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className="flex items-center gap-6 relative"
                            >
                                {/* Center node */}
                                <div className="relative z-10 shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg wbg-glow-pulse order-1 md:order-2"
                                    style={{
                                        background: 'var(--wbg-grad-gold)',
                                        boxShadow: 'var(--wbg-shadow-gold)',
                                    }}
                                >
                                    {ev.icon}
                                </div>

                                {/* Card konten */}
                                <div
                                    className={`flex-1 p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] order-2 text-left ${i % 2 === 0 ? 'md:order-1 md:text-right' : 'md:order-3 md:text-left'}`}
                                    style={{
                                        border: '1px solid var(--wbg-border-gold)',
                                        background: 'rgba(201,168,76,0.04)',
                                    }}
                                >
                                    <h4
                                        className="text-base mb-1"
                                        style={{ fontFamily: 'var(--wbg-font-display)', color: 'var(--wbg-gold)', fontSize: '0.9rem' }}
                                    >
                                        {ev.label}
                                    </h4>
                                    <p className="text-sm" style={{ color: 'var(--wbg-text-dim)' }}>
                                        {ev.desc}
                                    </p>
                                </div>

                                {/* Spacer sisi lain */}
                                <div className={`flex-1 hidden md:block ${i % 2 === 0 ? 'order-3' : 'order-1'}`} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Nama mempelai di bawah */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <span
                        className="text-4xl wbg-shimmer-text"
                        style={{ fontFamily: 'var(--wbg-font-script)' }}
                    >
                        {data.groomShort} & {data.brideShort}
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
