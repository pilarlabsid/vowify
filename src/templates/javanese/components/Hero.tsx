'use client';

import { motion } from "framer-motion";
import { MailOpen } from "lucide-react";
import Image from "next/image";

import { WeddingData } from "@/lib/types";

interface HeroProps {
    onOpen: () => void;
    guestName?: string;
    data: WeddingData;
}

export default function Hero({ onOpen, guestName, data }: HeroProps) {
    const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <motion.section
            initial={{ opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-elegant text-cream overflow-hidden"
        >
            {/* Batik Background Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] grayscale"></div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="relative z-10 text-center px-4"
            >
                <p className="text-gold tracking-[0.2em] mb-4 uppercase text-sm font-light">The Wedding Of</p>
                <h1 className="text-6xl md:text-8xl font-script text-gold mb-6">{data.groomShort} & {data.brideShort}</h1>
                <p className="text-gold/80 italic font-serif text-lg mb-12">{formattedDate}</p>

                {guestName && (
                    <div className="mb-12 animate-fade-in">
                        <p className="text-cream/60 text-sm mb-2">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
                        <h2 className="text-2xl font-serif text-cream">{guestName}</h2>
                    </div>
                )}

                <button
                    onClick={onOpen}
                    className="group flex items-center gap-3 bg-gold text-primary px-8 py-4 rounded-full font-semibold hover:bg-cream transition-all duration-300 shadow-xl"
                >
                    <MailOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Buka Undangan
                </button>
            </motion.div>

            {/* Decorative Ornaments */}
            <div className="absolute top-10 left-10 w-32 h-32 border-l-2 border-t-2 border-gold/30 rounded-tl-3xl opacity-50"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 border-r-2 border-b-2 border-gold/30 rounded-br-3xl opacity-50"></div>
        </motion.section>
    );
}
