'use client';

import { motion } from "framer-motion";
import { WeddingData } from "@/lib/types";

const STORY_EVENTS = [
    { icon: '✦', label: 'Pertemuan Pertama', desc: 'Awal dari sebuah cerita yang indah.' },
    { icon: '♡', label: 'Menjalin Cinta', desc: 'Bersama melewati suka dan duka.' },
    { icon: '◇', label: 'Lamaran', desc: 'Janji setia di hadapan keluarga.' },
    { icon: '◈', label: 'Hari Pernikahan', desc: 'Dua jiwa menjadi satu untuk selamanya.' },
];

export default function Timeline({ data }: { data: WeddingData }) {
    const events = data.timeline && data.timeline.length > 0 ? data.timeline : STORY_EVENTS.map((e, i) => ({
        year: String(2020 + i),
        title: e.label,
        description: e.desc,
        icon: e.icon,
    }));

    return (
        <section className="py-20 md:py-28 px-6" style={{ background: 'var(--mn-bg-alt)' }}>
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mn-section-head"
                >
                    <p className="mn-label mb-3">Kisah Kita</p>
                    <h2>Our Story</h2>
                    <div className="mn-line-group mt-4">
                        <div className="line" />
                        <div className="dot" />
                        <div className="line" />
                    </div>
                </motion.div>

                {/* Timeline Container */}
                <div className="relative mt-12 md:mt-16">
                    {/* Vertical Line - Centered on all screens */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 mn-timeline-line w-px"
                    />

                    <div className="space-y-12 md:space-y-0 relative">
                        {events.map((ev, i) => {
                            const isRight = i % 2 !== 0;
                            return (
                                <div key={i} className="flex flex-col items-center md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
                                    
                                    {/* Left Side (Card for Even on Desktop) */}
                                    <div className="hidden md:flex justify-end p-4 lg:p-6">
                                        {!isRight && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -25 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                className="p-7 rounded-2xl text-right transition-all duration-300 hover:shadow-lg max-w-sm w-full"
                                                style={{
                                                    background: 'var(--mn-bg-card)',
                                                    border: '1px solid var(--mn-border)',
                                                    boxShadow: 'var(--mn-shadow-sm)',
                                                }}
                                            >
                                                <p className="mn-label mb-2" style={{ color: 'var(--mn-sage)' }}>{ev.year}</p>
                                                <h4 className="text-xl mb-1.5" style={{ fontFamily: 'var(--mn-font-serif)', color: 'var(--mn-text)' }}>
                                                    {ev.title}
                                                </h4>
                                                <p className="text-sm leading-relaxed" style={{ color: 'var(--mn-text-muted)' }}>
                                                    {ev.description}
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Center Node */}
                                    <div className="flex flex-col items-center py-3 md:py-4 relative z-10">
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true }}
                                            className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center border text-base shadow-sm shrink-0"
                                            style={{
                                                background: 'var(--mn-bg)',
                                                border: '1.5px solid var(--mn-sage)',
                                                color: 'var(--mn-sage)',
                                                boxShadow: 'var(--mn-shadow-sage)',
                                            }}
                                        >
                                            {'icon' in ev ? (ev as any).icon : '♡'}
                                        </motion.div>

                                        {/* Mobile View Card (Centered below node) */}
                                        <div className="md:hidden flex flex-col items-center mt-5 px-4 w-full">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                className="p-6 rounded-2xl text-center w-full max-w-xs"
                                                style={{
                                                    background: 'var(--mn-bg-card)',
                                                    border: '1px solid var(--mn-border)',
                                                    boxShadow: 'var(--mn-shadow-sm)',
                                                }}
                                            >
                                                <p className="mn-label mb-2" style={{ color: 'var(--mn-sage)' }}>{ev.year}</p>
                                                <h4 className="text-lg mb-1.5" style={{ fontFamily: 'var(--mn-font-serif)', color: 'var(--mn-text)' }}>
                                                    {ev.title}
                                                </h4>
                                                <p className="text-sm leading-relaxed" style={{ color: 'var(--mn-text-muted)' }}>
                                                    {ev.description}
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Right Side (Card for Odd on Desktop) */}
                                    <div className="hidden md:flex justify-start p-4 lg:p-6">
                                        {isRight && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 25 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                className="p-7 rounded-2xl text-left transition-all duration-300 hover:shadow-lg max-w-sm w-full"
                                                style={{
                                                    background: 'var(--mn-bg-card)',
                                                    border: '1px solid var(--mn-border)',
                                                    boxShadow: 'var(--mn-shadow-sm)',
                                                }}
                                            >
                                                <p className="mn-label mb-2" style={{ color: 'var(--mn-sage)' }}>{ev.year}</p>
                                                <h4 className="text-xl mb-1.5" style={{ fontFamily: 'var(--mn-font-serif)', color: 'var(--mn-text)' }}>
                                                    {ev.title}
                                                </h4>
                                                <p className="text-sm leading-relaxed" style={{ color: 'var(--mn-text-muted)' }}>
                                                    {ev.description}
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Closing names */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mn-names text-center mt-12 md:mt-20"
                    style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--mn-text)' }}
                >
                    {data.groomShort} &amp; {data.brideShort}
                </motion.p>
            </div>
        </section>
    );
}
