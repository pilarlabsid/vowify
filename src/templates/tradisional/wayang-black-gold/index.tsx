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
import WayangDivider from "./components/WayangDivider";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import './styles.css';

interface WayangBlackGoldTemplateProps {
    data: WeddingData;
    guestName?: string;
}

export default function WayangBlackGoldTemplate({ data, guestName }: WayangBlackGoldTemplateProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "auto" : "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, [isOpen]);

    return (
        <main data-template="wayang-black-gold" className="relative min-h-screen">
            {/* ── Global Batik Kawung Background (SVG lokal) ── */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <svg className="w-full h-full opacity-[0.018]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="wbg-kawung-global" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                            <ellipse cx="30" cy="15" rx="11" ry="7" fill="none" stroke="#C9A84C" strokeWidth="1.2" />
                            <ellipse cx="30" cy="45" rx="11" ry="7" fill="none" stroke="#C9A84C" strokeWidth="1.2" />
                            <ellipse cx="15" cy="30" rx="7" ry="11" fill="none" stroke="#C9A84C" strokeWidth="1.2" />
                            <ellipse cx="45" cy="30" rx="7" ry="11" fill="none" stroke="#C9A84C" strokeWidth="1.2" />
                            <circle cx="30" cy="30" r="5" fill="none" stroke="#C9A84C" strokeWidth="1.2" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#wbg-kawung-global)" />
                </svg>
            </div>

            {/* ── Hero / Amplop pembuka ── */}
            <AnimatePresence>
                {!isOpen && (
                    <Hero
                        onOpen={() => setIsOpen(true)}
                        guestName={guestName}
                        data={data}
                    />
                )}
            </AnimatePresence>

            {/* ── Konten utama ── */}
            <div className={`relative transition-all duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>

                <Quote />

                <WayangDivider />

                <BrideGroom data={data} />

                <WayangDivider flipped />

                <EventDetail data={data} />

                <WayangDivider />

                <Gallery data={data} />

                <Timeline data={data} />

                <WayangDivider flipped />

                <RSVP weddingId={data.id} />

                <Envelope data={data} />

                <Footer data={data} />

                {isOpen && <GamelanPlayer />}
            </div>
        </main>
    );
}
