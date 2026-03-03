'use client';

import { motion } from "framer-motion";
import GununganDivider from "./GununganDivider";

import { WeddingData } from "@/lib/types";

export default function Footer({ data }: { data: WeddingData }) {
    return (
        <footer className="py-24 px-6 bg-elegant text-gold text-center relative overflow-hidden">
            {/* Footer Ornament Background */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] grayscale shadow-inner"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="max-w-4xl mx-auto relative z-10"
            >
                <GununganDivider className="mb-12 opacity-80" />

                <h2 className="text-5xl font-script text-gold mb-8">Terima Kasih</h2>
                <p className="text-gold/60 max-w-xl mx-auto font-body italic mb-16 leading-loose px-4">
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                </p>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center">
                        <p className="text-xs uppercase tracking-[0.5em] font-light mb-4 text-gold/40">Keluarga Besar</p>
                        <div className="flex gap-12 items-center text-sm font-medium uppercase tracking-widest text-gold/80 italic">
                            <span>{data.brideParents}</span>
                            <span className="text-2xl font-script opacity-40">&</span>
                            <span>{data.groomParents}</span>
                        </div>
                    </div>

                    <div className="w-16 h-[1px] bg-gold/10 mt-12 mb-8"></div>

                    <div className="space-y-4">
                        <h3 className="text-2xl font-serif text-gold tracking-[0.2em] font-light">{data.groomShort} & {data.brideShort}</h3>
                        <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-40">Since 2026</p>
                    </div>
                </div>

                <div className="mt-24 pt-12 border-t border-gold/5 flex flex-col items-center gap-4">
                    <p className="text-[10px] uppercase tracking-widest text-gold/30 font-medium">Digital Wedding Invitation By</p>
                    <p className="text-sm font-script text-gold/80 hover:text-gold cursor-pointer transition-colors scale-125">@antigravity</p>
                </div>
            </motion.div>
        </footer>
    );
}
