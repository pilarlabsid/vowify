'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { WeddingData } from "@/lib/types";

export default function Footer({ data }: { data: WeddingData }) {
    return (
        <footer
            className="py-24 px-6 text-center relative overflow-hidden"
            style={{ background: 'var(--wbg-black-deep)' }}
        >
            {/* Asset 3.2 — background footer ornamen wayang */}
            <div className="absolute inset-0 pointer-events-none">
                <Image
                    src="/templates/wayang-black-gold/3.2.webp"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                    style={{ filter: 'sepia(1) saturate(0.3) brightness(0.2) hue-rotate(20deg)', opacity: 0.25 }}
                />
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.85) 80%)'
                }} />
            </div>

            {/* 10.4 & 10.5 corner ornaments */}
            <div className="absolute top-0 left-0 w-36 h-36 pointer-events-none opacity-15">
                <Image src="/templates/wayang-black-gold/10.4.webp" alt="" fill
                    sizes="144px"
                    className="object-contain"
                    style={{ filter: 'sepia(1) saturate(0.4) brightness(0.4) hue-rotate(20deg)' }}
                />
            </div>
            <div className="absolute top-0 right-0 w-36 h-36 pointer-events-none opacity-15">
                <Image src="/templates/wayang-black-gold/10.5.webp" alt="" fill
                    sizes="144px"
                    className="object-contain"
                    style={{ filter: 'sepia(1) saturate(0.4) brightness(0.4) hue-rotate(20deg)' }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="max-w-3xl mx-auto relative z-10"
            >
                {/* Ornamen atas */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    <div className="h-px flex-1 max-w-[100px]" style={{ background: 'linear-gradient(to right, transparent, var(--wbg-gold))', opacity: 0.4 }} />
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="wbg-float">
                        <path d="M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z" fill="#C9A84C" fillOpacity="0.7" />
                        <path d="M20 6 L22 18 L34 20 L22 22 L20 34 L18 22 L6 20 L18 18 Z" fill="#E8C96A" fillOpacity="0.5" />
                    </svg>
                    <div className="h-px flex-1 max-w-[100px]" style={{ background: 'linear-gradient(to left, transparent, var(--wbg-gold))', opacity: 0.4 }} />
                </div>

                {/* Ucapan terima kasih */}
                <h2
                    className="text-5xl md:text-6xl mb-8 wbg-shimmer-text"
                    style={{ fontFamily: 'var(--wbg-font-script)' }}
                >
                    Terima Kasih
                </h2>

                <p
                    className="max-w-lg mx-auto mb-14 text-sm italic leading-loose px-4"
                    style={{ color: 'var(--wbg-text-dim)', fontFamily: 'var(--wbg-font-body)' }}
                >
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                </p>

                {/* Keluarga */}
                <div className="flex flex-col items-center gap-6 mb-14">
                    <p className="wbg-label" style={{ opacity: 0.45 }}>Keluarga Besar</p>
                    <div className="flex flex-wrap justify-center gap-6 items-center text-sm uppercase tracking-widest" style={{ color: 'var(--wbg-text-light)', opacity: 0.75 }}>
                        <span style={{ fontFamily: 'var(--wbg-font-body)' }}>{data.brideParents}</span>
                        <span
                            className="text-2xl"
                            style={{ fontFamily: 'var(--wbg-font-script)', color: 'var(--wbg-gold)', opacity: 0.35 }}
                        >
                            &
                        </span>
                        <span style={{ fontFamily: 'var(--wbg-font-body)' }}>{data.groomParents}</span>
                    </div>
                </div>

                {/* Garis pemisah */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-px flex-1" style={{ background: 'var(--wbg-border-gold)' }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--wbg-gold)', opacity: 0.4 }} />
                    <div className="h-px flex-1" style={{ background: 'var(--wbg-border-gold)' }} />
                </div>

                {/* Nama mempelai */}
                <div className="space-y-2 mb-16">
                    <h3
                        className="text-3xl wbg-shimmer-text"
                        style={{ fontFamily: 'var(--wbg-font-script)' }}
                    >
                        {data.groomShort} & {data.brideShort}
                    </h3>
                    <p className="wbg-label" style={{ opacity: 0.3 }}>Forever & Always</p>
                </div>

                {/* Credit */}
                <div
                    className="pt-10 flex flex-col items-center gap-2"
                    style={{ borderTop: '1px solid var(--wbg-border-gold)', opacity: 0.5 }}
                >
                    <p className="wbg-label" style={{ opacity: 0.6 }}>Digital Wedding Invitation by</p>
                    <p
                        className="text-sm hover:opacity-100 transition-opacity cursor-pointer"
                        style={{ fontFamily: 'var(--wbg-font-script)', color: 'var(--wbg-gold)', fontSize: '1.1rem' }}
                    >
                        Vowify.id
                    </p>
                </div>
            </motion.div>
        </footer>
    );
}
