'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { WeddingData } from "@/lib/types";
import { resolvePhoto } from "@/templates/registry";

export default function HeroMain({ data }: { data: WeddingData }) {
    const photos = (data.photos ?? {}) as Record<string, string>;
    const heroCoupleImg = resolvePhoto(photos, 'hero_couple');

    const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Full-bleed background image */}
            {heroCoupleImg && (
                <>
                    <Image
                        src={heroCoupleImg}
                        alt="Cover"
                        fill
                        unoptimized
                        className="object-cover object-center"
                        priority
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to bottom, rgba(250,250,248,0.15) 0%, rgba(20,20,18,0.55) 60%, rgba(20,20,18,0.92) 100%)' }}
                    />
                </>
            )}

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="relative z-10 text-center px-6"
                style={{ color: heroCoupleImg ? 'var(--mn-text-light)' : 'var(--mn-text)' }}
            >
                <p className="mn-label mb-8" style={{ color: heroCoupleImg ? 'var(--mn-sage-light)' : 'var(--mn-sage)' }}>
                    The Wedding Of
                </p>

                <h1
                    className="mn-names"
                    style={{
                        fontSize: 'clamp(3.5rem, 12vw, 8rem)',
                        color: heroCoupleImg ? '#FAFAF8' : 'var(--mn-text)',
                        textShadow: heroCoupleImg ? '0 2px 24px rgba(0,0,0,0.4)' : 'none',
                    }}
                >
                    {data.groomShort} <span style={{ fontFamily: 'var(--mn-font-serif)', fontStyle: 'italic', color: 'var(--mn-sage-light)' }}>&amp;</span> {data.brideShort}
                </h1>

                <div className="mt-6 mb-8">
                    <div className="mn-line-group">
                        <div className="line" />
                        <div className="dot" />
                        <div className="line" />
                    </div>
                </div>

                <p className="text-sm tracking-widest" style={{ color: heroCoupleImg ? 'rgba(249,248,244,0.75)' : 'var(--mn-text-muted)' }}>
                    {formattedDate}
                </p>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                style={{ color: heroCoupleImg ? 'rgba(249,248,244,0.5)' : 'var(--mn-text-dim)' }}
            >
                <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    className="w-px h-8"
                    style={{ background: heroCoupleImg ? 'rgba(242,245,243,0.4)' : 'var(--mn-sage)' }}
                />
            </motion.div>
        </section>
    );
}
