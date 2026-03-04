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
        if (!isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);

    return (
        <main data-template="javanese" className="relative min-h-screen">
            <div className="fixed inset-0 jv-batik pointer-events-none z-0"></div>

            <AnimatePresence>
                {!isOpen && (
                    <Hero
                        onOpen={() => setIsOpen(true)}
                        guestName={guestName}
                        data={data}
                    />
                )}
            </AnimatePresence>

            <div className={`transition-all duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
                <Quote />
                <GununganDivider />
                <BrideGroom data={data} />
                <GununganDivider className="rotate-180" />
                <EventDetail data={data} />
                <GununganDivider />
                <Gallery data={data} />
                <Timeline data={data} />
                <RSVP weddingId={data.id} />
                <GununganDivider />
                <Envelope data={data} />
                <Footer data={data} />

                {isOpen && <GamelanPlayer />}
            </div>
        </main>
    );
}
