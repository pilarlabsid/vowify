'use client';

import { motion, AnimatePresence } from "framer-motion";
import { MailOpen } from "lucide-react";
import Image from "next/image";
import { WeddingData } from "@/lib/types";
import { resolvePhoto } from "@/templates/registry";

interface HeroProps {
    data: WeddingData;
    guestName?: string;
    onOpen: () => void;
}

export default function Hero({ data, guestName, onOpen }: HeroProps) {
    const photos = (data.photos ?? {}) as Record<string, string>;
    const heroCoupleImg = resolvePhoto(photos, 'hero_couple');

    const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <AnimatePresence>
            <motion.section
                initial={{ opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                className="fixed inset-0 z-[100] flex"
                style={{ background: 'var(--mn-bg)' }}
            >
                {/* Left — Photo */}
                <div className="hidden md:block md:w-1/2 relative overflow-hidden">
                    {heroCoupleImg ? (
                        <Image
                            src={heroCoupleImg}
                            alt="Cover"
                            fill
                            unoptimized
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full" style={{ background: 'var(--mn-bg-alt)' }} />
                    )}
                    {/* gradient overlay */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, var(--mn-bg) 100%)' }} />
                </div>

                {/* Right — Text */}
                <div className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 relative">
                    {/* Mobile photo bg */}
                    <div className="absolute inset-0 md:hidden">
                        {heroCoupleImg && (
                            <>
                                <Image src={heroCoupleImg} alt="" fill unoptimized className="object-cover" />
                                <div className="absolute inset-0" style={{ background: 'rgba(250,250,248,0.88)' }} />
                            </>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.9 }}
                        className="relative z-10 text-center max-w-sm"
                    >
                        <p className="mn-label mb-6">The Wedding Of</p>

                        <h1 className="mn-names mb-2" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}>
                            {data.groomShort}
                        </h1>
                        <p className="mb-2" style={{ color: 'var(--mn-sage)', fontFamily: 'var(--mn-font-serif)', fontSize: '1.5rem', fontWeight: 300 }}>
                            &amp;
                        </p>
                        <h1 className="mn-names mb-8" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}>
                            {data.brideShort}
                        </h1>

                        <div className="mn-hr" />

                        <p className="text-sm mb-3 tracking-wide" style={{ color: 'var(--mn-text-muted)' }}>
                            {formattedDate}
                        </p>

                        {guestName && (
                            <div className="mb-8 mt-6 py-4 px-6 rounded-xl" style={{ border: '1px solid var(--mn-border)' }}>
                                <p className="mn-label mb-1">Kepada Yth.</p>
                                <p className="text-base font-medium" style={{ color: 'var(--mn-text)' }}>{guestName}</p>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onOpen}
                            className="mn-btn-dark mn-btn mt-6"
                        >
                            <MailOpen className="w-4 h-4" />
                            Buka Undangan
                        </motion.button>
                    </motion.div>
                </div>
            </motion.section>
        </AnimatePresence>
    );
}
