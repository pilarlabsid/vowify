'use client';

import { WeddingData } from "@/lib/types";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MailOpen, MapPin, Clock, CalendarHeart } from "lucide-react";
import Image from "next/image";

interface Props {
    data: WeddingData;
    guestName?: string;
}

export default function ElegantTemplate({ data, guestName }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);

    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <main className="relative min-h-screen bg-[#0a0f12] text-[#e0cfb3] font-serif selection:bg-[#c9a763] selection:text-black">
            {/* Background texture pattern for elegant look */}
            <div className="fixed inset-0 opacity-5 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>

            <AnimatePresence>
                {!isOpen && (
                    <motion.section
                        initial={{ opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0f12] text-[#c9a763]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f12]/50 to-[#0a0f12] z-0 pointer-events-none"></div>
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-center px-6 relative z-10 p-12 border border-[#c9a763]/20 rounded-3xl"
                        >
                            <p className="text-[#a8905b] tracking-[0.4em] mb-6 uppercase text-xs font-sans">The Wedding Celebration</p>
                            <h1 className="text-6xl md:text-8xl font-light mb-6 font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#c9a763] via-[#e8dcb8] to-[#c9a763]">
                                {data.groomShort} &amp; {data.brideShort}
                            </h1>
                            <p className="text-[#a8905b] text-sm mb-12 tracking-[0.2em] uppercase font-sans">{formattedDate}</p>

                            {guestName && (
                                <div className="mb-12 border-t border-[#c9a763]/20 pt-8">
                                    <p className="text-[#a8905b] text-xs mb-3 uppercase tracking-widest font-sans">Specially Invited</p>
                                    <h2 className="text-2xl font-medium text-[#e8dcb8]">{guestName}</h2>
                                </div>
                            )}

                            <button
                                onClick={() => setIsOpen(true)}
                                className="group flex items-center gap-3 bg-gradient-to-r from-[#c9a763] to-[#a8905b] text-[#0a0f12] px-10 py-4 rounded-full text-sm font-sans font-semibold hover:shadow-lg hover:shadow-[#c9a763]/20 transition-all mx-auto duration-500"
                            >
                                <MailOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Open Invitation
                            </button>
                        </motion.div>
                    </motion.section>
                )}
            </AnimatePresence>

            <div className={`transition-opacity duration-1000 relative z-10 ${isOpen ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
                {/* Hero Section */}
                <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
                    <div className="absolute w-[600px] h-[600px] bg-[#c9a763]/10 rounded-full blur-[120px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <p className="text-[#a8905b] tracking-[0.3em] uppercase text-sm mb-6 font-sans">We Invite You To Celebrate</p>
                        <h1 className="text-5xl md:text-7xl font-light mb-8 italic text-transparent bg-clip-text bg-gradient-to-r from-[#c9a763] via-[#e8dcb8] to-[#c9a763]">
                            {data.brideName}
                            <br /><span className="text-3xl font-sans not-italic text-[#a8905b] my-4 block">&amp;</span>
                            {data.groomName}
                        </h1>
                        <p className="text-[#e8dcb8] tracking-[0.2em] uppercase text-sm font-sans">{formattedDate}</p>
                    </motion.div>
                </section>

                {/* Events Section */}
                <section className="py-24 px-6 bg-[#11171a] border-y border-[#c9a763]/10">
                    <div className="max-w-5xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-center text-3xl font-light mb-16 tracking-[0.2em] uppercase text-[#c9a763] font-sans"
                        >
                            Event Details
                        </motion.h2>
                        <div className="grid md:grid-cols-2 gap-12">
                            <EventCard
                                title="Holy Matrimony"
                                date={formattedDate}
                                time={data.akad.time}
                                location={data.akad.location}
                                address={data.akad.address}
                                mapUrl={data.akad.mapUrl}
                            />
                            <EventCard
                                title="Wedding Reception"
                                date={formattedDate}
                                time={data.resepsi.time}
                                location={data.resepsi.location}
                                address={data.resepsi.address}
                                mapUrl={data.resepsi.mapUrl}
                            />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-16 text-center text-[#a8905b] text-sm font-sans tracking-wider border-t border-[#c9a763]/10">
                    <p className="mb-2 italic font-serif text-xl text-[#c9a763]">{data.groomShort} & {data.brideShort}</p>
                    <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                </footer>
            </div>
        </main>
    );
}

function EventCard({ title, date, time, location, address, mapUrl }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 border border-[#c9a763]/20 rounded-xl text-center flex flex-col items-center bg-[#0a0f12] hover:border-[#c9a763]/50 transition-colors duration-500"
        >
            <h3 className="text-2xl font-italic text-[#e8dcb8] mb-8">{title}</h3>
            <div className="space-y-5 text-[#a8905b] text-sm mb-10 w-full font-sans">
                <div className="flex items-center justify-center gap-3">
                    <CalendarHeart className="w-5 h-5 text-[#c9a763]" />
                    <span className="tracking-wide">{date}</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                    <Clock className="w-5 h-5 text-[#c9a763]" />
                    <span className="tracking-wide">{time}</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 mt-6 pt-6 border-t border-[#c9a763]/20">
                    <MapPin className="w-5 h-5 text-[#c9a763] mb-2" />
                    <span className="font-medium text-[#e8dcb8] text-base">{location}</span>
                    <span className="text-xs text-[#a8905b]/70 max-w-[250px] leading-relaxed">{address}</span>
                </div>
            </div>
            <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-auto px-8 py-3 border border-[#c9a763] text-[#c9a763] rounded-full text-sm font-sans hover:bg-[#c9a763] hover:text-[#0a0f12] transition-colors duration-300 uppercase tracking-widest w-full"
            >
                View Location
            </a>
        </motion.div>
    );
}
