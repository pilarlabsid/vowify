'use client';

import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { WeddingData } from "@/lib/types";
import Image from "next/image";

const CountdownItem = ({ label, val }: { label: string; val: number }) => (
    <div
        className="flex flex-col items-center justify-center py-3 w-full rounded-xl"
        style={{ border: '1px solid var(--wbg-border-gold)', background: 'rgba(201,168,76,0.05)' }}
    >
        <span
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: 'var(--wbg-font-display)', color: 'var(--wbg-gold)', lineHeight: 1 }}
        >
            {val.toString().padStart(2, '0')}
        </span>
        <span className="wbg-label mt-1" style={{ opacity: 0.6 }}>{label}</span>
    </div>
);

export default function EventDetail({ data }: { data: WeddingData }) {
    const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const target = new Date(data.date).getTime();
        const timer = setInterval(() => {
            const diff = target - Date.now();
            if (diff <= 0) { clearInterval(timer); return; }
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [data.date]);

    return (
        <section
            className="py-24 px-6 relative overflow-hidden"
            style={{ background: 'var(--wbg-black-soft)' }}
        >
            {/* Asset 5.1 — kiri atas */}
            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-56 pointer-events-none">
                <Image
                    src="/templates/wayang-black-gold/5.1.webp"
                    alt=""
                    fill
                    sizes="224px"
                    className="object-contain object-left-top opacity-20"
                    style={{ filter: 'sepia(1) saturate(0.4) brightness(0.4) hue-rotate(20deg)' }}
                />
            </div>

            {/* Asset 5.2 — kanan bawah */}
            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-56 pointer-events-none">
                <Image
                    src="/templates/wayang-black-gold/5.2.webp"
                    alt=""
                    fill
                    sizes="224px"
                    className="object-contain object-right-bottom opacity-20"
                    style={{ filter: 'sepia(1) saturate(0.4) brightness(0.4) hue-rotate(20deg)' }}
                />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Judul & Countdown */}
                <div className="text-center mb-16">
                    <p className="wbg-label mb-3">Menuju Hari Bahagia</p>
                    <h2
                        className="text-3xl md:text-4xl mb-10"
                        style={{ fontFamily: 'var(--wbg-font-display)', color: 'var(--wbg-gold)' }}
                    >
                        Momen Bahagia
                    </h2>
                    <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-[320px] md:max-w-[400px] mx-auto px-2">
                        <CountdownItem label="Hari" val={timeLeft.days} />
                        <CountdownItem label="Jam" val={timeLeft.hours} />
                        <CountdownItem label="Menit" val={timeLeft.minutes} />
                        <CountdownItem label="Detik" val={timeLeft.seconds} />
                    </div>
                </div>

                {/* Cards Akad & Resepsi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Akad */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-2xl relative overflow-hidden group transition-all duration-500"
                        style={{
                            border: '1px solid var(--wbg-border-gold)',
                            background: 'rgba(201,168,76,0.03)',
                        }}
                    >
                        {/* Gold corner ornaments */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-l border-t opacity-60" style={{ borderColor: 'var(--wbg-gold)' }} />
                        <div className="absolute top-0 right-0 w-12 h-12 border-r border-t opacity-60" style={{ borderColor: 'var(--wbg-gold)' }} />
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-l border-b opacity-60" style={{ borderColor: 'var(--wbg-gold)' }} />
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-r border-b opacity-60" style={{ borderColor: 'var(--wbg-gold)' }} />

                        <h3
                            className="text-2xl mb-6"
                            style={{ fontFamily: 'var(--wbg-font-script)', color: 'var(--wbg-gold)', fontSize: '2rem' }}
                        >
                            Akad Nikah
                        </h3>

                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-4">
                                <Calendar className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--wbg-gold)' }} />
                                <span style={{ color: 'var(--wbg-text-light)' }}>{formattedDate}</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--wbg-gold)' }} />
                                <span style={{ color: 'var(--wbg-text-light)' }}>{data.akad.time}</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="w-4 h-4 mt-1 shrink-0" style={{ color: 'var(--wbg-gold)' }} />
                                <div>
                                    <p className="font-semibold mb-1" style={{ color: 'var(--wbg-gold)' }}>{data.akad.location}</p>
                                    <p className="text-xs leading-relaxed" style={{ color: 'var(--wbg-text-dim)' }}>{data.akad.address}</p>
                                </div>
                            </div>
                        </div>

                        <a
                            href={data.akad.mapUrl}
                            target="_blank"
                            className="mt-8 block py-3 rounded-full text-center text-xs font-bold uppercase tracking-widest transition-all hover:opacity-90 wbg-btn-filled"
                            style={{ fontFamily: 'var(--wbg-font-display)', background: 'var(--wbg-grad-gold)', color: 'var(--wbg-black)' }}
                        >
                            Buka Google Maps
                        </a>
                    </motion.div>

                    {/* Resepsi */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-2xl relative overflow-hidden group transition-all duration-500"
                        style={{
                            border: '1px solid var(--wbg-border-gold)',
                            background: 'rgba(201,168,76,0.03)',
                        }}
                    >
                        {/* Gold corner ornaments */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-l border-t opacity-60" style={{ borderColor: 'var(--wbg-gold)' }} />
                        <div className="absolute top-0 right-0 w-12 h-12 border-r border-t opacity-60" style={{ borderColor: 'var(--wbg-gold)' }} />
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-l border-b opacity-60" style={{ borderColor: 'var(--wbg-gold)' }} />
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-r border-b opacity-60" style={{ borderColor: 'var(--wbg-gold)' }} />

                        <h3
                            className="text-2xl mb-6"
                            style={{ fontFamily: 'var(--wbg-font-script)', color: 'var(--wbg-gold)', fontSize: '2rem' }}
                        >
                            Resepsi
                        </h3>

                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-4">
                                <Calendar className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--wbg-gold)' }} />
                                <span style={{ color: 'var(--wbg-text-light)' }}>{formattedDate}</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--wbg-gold)' }} />
                                <span style={{ color: 'var(--wbg-text-light)' }}>{data.resepsi.time}</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="w-4 h-4 mt-1 shrink-0" style={{ color: 'var(--wbg-gold)' }} />
                                <div>
                                    <p className="font-semibold mb-1" style={{ color: 'var(--wbg-gold)' }}>{data.resepsi.location}</p>
                                    <p className="text-xs leading-relaxed" style={{ color: 'var(--wbg-text-dim)' }}>{data.resepsi.address}</p>
                                </div>
                            </div>
                        </div>

                        <a
                            href={data.resepsi.mapUrl}
                            target="_blank"
                            className="mt-8 block py-3 rounded-full text-center text-xs font-bold uppercase tracking-widest transition-all hover:opacity-90"
                            style={{ fontFamily: 'var(--wbg-font-display)', background: 'var(--wbg-grad-gold)', color: 'var(--wbg-black)' }}
                        >
                            Buka Google Maps
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
