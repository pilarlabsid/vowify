'use client';

import { WeddingData } from "@/lib/types";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import Hero     from "./components/Hero";
import HeroMain from "./components/HeroMain";
import Couple   from "./components/Couple";
import Events   from "./components/Events";
import Gallery  from "./components/Gallery";
import Timeline from "./components/Timeline";
import RSVP     from "./components/RSVP";
import Gift     from "./components/Gift";
import Footer   from "./components/Footer";
import Divider  from "./components/Divider";

import './styles.css';

interface Props {
    data: WeddingData;
    guestName?: string;
}

export default function MinimalistTemplate({ data, guestName }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "auto" : "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, [isOpen]);

    return (
        <main data-template="minimalist" className="relative min-h-screen">

            {/* ── Envelope / Opening screen ── */}
            <AnimatePresence>
                {!isOpen && (
                    <Hero
                        data={data}
                        guestName={guestName}
                        onOpen={() => setIsOpen(true)}
                    />
                )}
            </AnimatePresence>

            {/* ── Main content (fades in after opening) ── */}
            <div className={`relative transition-all duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>

                {/* 1. Hero — full-bleed cover photo */}
                <HeroMain data={data} />

                <Divider />

                {/* 2. Couple profiles */}
                <Couple data={data} />

                <Divider />

                {/* 3. Events — Akad & Resepsi */}
                <Events data={data} />

                <Divider />

                {/* 4. Gallery */}
                <Gallery data={data} />

                <Divider />

                {/* 5. Timeline / love story */}
                <Timeline data={data} />

                {/* 6. RSVP — dark section */}
                <RSVP weddingId={data.id} />

                {/* 7. Digital Gift / Amplop */}
                <Gift data={data} />

                {/* 8. Footer */}
                <Footer data={data} />
            </div>
        </main>
    );
}
