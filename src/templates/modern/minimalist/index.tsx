'use client';

import { WeddingData } from "@/lib/types";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MailOpen, MapPin, Clock, CalendarHeart } from "lucide-react";
import Image from "next/image";
import './styles.css';

interface Props {
    data: WeddingData;
    guestName?: string;
}

export default function MinimalistTemplate({ data, guestName }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);

    const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <main data-template="minimalist" className="relative min-h-screen">
            <AnimatePresence>
                {!isOpen && (
                    <motion.section
                        initial={{ opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-50"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-center px-6"
                        >
                            <p className="text-zinc-400 tracking-[0.3em] mb-4 uppercase text-xs">The Wedding Of</p>
                            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
                                {data.groomShort} <span className="text-zinc-300 font-serif italic">&amp;</span> {data.brideShort}
                            </h1>
                            <p className="text-zinc-500 text-sm mb-12 tracking-wide">{formattedDate}</p>

                            {guestName && (
                                <div className="mb-12">
                                    <p className="text-zinc-400 text-xs mb-2 uppercase tracking-widest">Dear</p>
                                    <h2 className="text-xl font-medium text-zinc-800">{guestName}</h2>
                                </div>
                            )}

                            <button
                                onClick={() => setIsOpen(true)}
                                className="group flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-full text-sm hover:bg-zinc-800 transition-colors mx-auto"
                            >
                                <MailOpen className="w-4 h-4" />
                                Open Invitation
                            </button>
                        </motion.div>
                    </motion.section>
                )}
            </AnimatePresence>

            <div className={`transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
                {/* Hero Section */}
                <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="w-full max-w-xl aspect-[3/4] relative mb-12 rounded-2xl overflow-hidden"
                    >
                        <Image
                            src={data.gallery[0] || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070'}
                            alt="Couple"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-4 text-center">
                        {data.brideShort} & {data.groomShort}
                    </h1>
                    <p className="text-zinc-500 tracking-widest uppercase text-sm">{formattedDate}</p>
                </section>

                {/* Profile Section */}
                <section className="py-24 px-6 bg-zinc-50">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-16 md:gap-8">
                            <div className="text-center">
                                <div className="w-48 h-48 mx-auto relative rounded-full overflow-hidden mb-6">
                                    <Image src={data.brideImage || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070'} alt={data.brideName} fill className="object-cover" />
                                </div>
                                <h3 className="text-2xl font-medium mb-2">{data.brideName}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">
                                    Putri dari<br />{data.brideParents}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-48 h-48 mx-auto relative rounded-full overflow-hidden mb-6">
                                    <Image src={data.groomImage || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070'} alt={data.groomName} fill className="object-cover" />
                                </div>
                                <h3 className="text-2xl font-medium mb-2">{data.groomName}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">
                                    Putra dari<br />{data.groomParents}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Events Section */}
                <section className="py-24 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-center text-3xl font-light mb-16 tracking-tight">The Events</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <EventCard
                                title="Akad Nikah"
                                date={formattedDate}
                                time={data.akad.time}
                                location={data.akad.location}
                                address={data.akad.address}
                                mapUrl={data.akad.mapUrl}
                            />
                            <EventCard
                                title="Resepsi"
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
                <footer className="py-12 text-center text-zinc-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} {data.groomShort} & {data.brideShort}. All rights reserved.</p>
                </footer>
            </div>
        </main>
    );
}

function EventCard({ title, date, time, location, address, mapUrl }: any) {
    return (
        <div className="bg-zinc-50 p-8 rounded-2xl text-center flex flex-col items-center">
            <h3 className="text-xl font-medium mb-6">{title}</h3>
            <div className="space-y-4 text-zinc-600 text-sm mb-8 w-full">
                <div className="flex items-center justify-center gap-3">
                    <CalendarHeart className="w-4 h-4 text-zinc-400" />
                    <span>{date}</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span>{time}</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 mt-4 pt-4 border-t border-zinc-200">
                    <MapPin className="w-4 h-4 text-zinc-400 mb-2" />
                    <span className="font-medium text-zinc-900">{location}</span>
                    <span className="text-xs text-zinc-500 max-w-[200px]">{address}</span>
                </div>
            </div>
            <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-auto px-6 py-3 border border-zinc-200 rounded-full text-sm hover:bg-zinc-100 transition-colors w-full"
            >
                View Map
            </a>
        </div>
    );
}
