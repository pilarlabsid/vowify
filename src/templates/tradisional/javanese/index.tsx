'use client';

import { WeddingData } from "@/lib/types";
import Hero from "./components/Hero";
import Quote from "./components/Quote";
import BrideGroom from "./components/BrideGroom";
import EventDetail from "./components/EventDetail";
import Gallery from "./components/Gallery";
import Timeline from "./components/Timeline";
import RSVP from "./components/RSVP";
import Envelope from "./components/Envelope";
import Footer from "./components/Footer";
import GamelanPlayer from "./components/GamelanPlayer";
import GununganDivider from "./components/GununganDivider";
import KalaOrnament from "./components/KalaOrnament";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import './styles.css';

interface JavaneseTemplateProps {
    data: WeddingData;
    guestName?: string;
}

export default function JavaneseTemplate({ data, guestName }: JavaneseTemplateProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "auto" : "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, [isOpen]);

    return (
        <main data-template="javanese" className="relative min-h-screen">
            {/* ── Kawung Batik Background (SVG lokal, tidak bergantung CDN) ── */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <svg className="w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="kawung-global" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
                            <ellipse cx="28" cy="14" rx="10" ry="7" fill="none" stroke="#6B4226" strokeWidth="1" />
                            <ellipse cx="28" cy="42" rx="10" ry="7" fill="none" stroke="#6B4226" strokeWidth="1" />
                            <ellipse cx="14" cy="28" rx="7" ry="10" fill="none" stroke="#6B4226" strokeWidth="1" />
                            <ellipse cx="42" cy="28" rx="7" ry="10" fill="none" stroke="#6B4226" strokeWidth="1" />
                            <circle cx="28" cy="28" r="5" fill="none" stroke="#6B4226" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#kawung-global)" />
                </svg>
            </div>

            {/* ── Envelope / Amplop (layar awal) ── */}
            <AnimatePresence>
                {!isOpen && (
                    <Hero
                        onOpen={() => setIsOpen(true)}
                        guestName={guestName}
                        data={data}
                    />
                )}
            </AnimatePresence>

            {/* ── Konten utama (muncul setelah buka undangan) ── */}
            <div className={`relative transition-all duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>

                <Quote />

                <KalaOrnament className="mt-0 -mb-2" />
                <GununganDivider />
                <KalaOrnament flipped className="-mt-2 mb-0" />

                <BrideGroom data={data} />

                <GununganDivider className="rotate-180" />

                <EventDetail data={data} />

                <GununganDivider />

                <Gallery data={data} />

                <Timeline data={data} />

                <GununganDivider className="rotate-180" />

                <RSVP weddingId={data.id} />

                <KalaOrnament className="mt-0" />

                <Envelope data={data} />

                <Footer data={data} />

                {isOpen && <GamelanPlayer />}
            </div>
        </main>
    );
}
