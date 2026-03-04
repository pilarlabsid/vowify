'use client';

import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { WeddingData } from "@/lib/types";

const CountdownItem = ({ label, val }: { label: string; val: number }) => (
    <div className="flex flex-col items-center p-4 bg-elegant/5 rounded-lg border border-gold/20 min-w-[80px]">
        <span className="text-3xl font-serif text-gold">{val.toString().padStart(2, '0')}</span>
        <span className="text-[10px] uppercase tracking-widest text-primary/60">{label}</span>
    </div>
);

export default function EventDetail({ data }: { data: WeddingData }) {
    const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const target = new Date(data.date).getTime();
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [data.date]);

    return (
        <section className="py-24 px-6 bg-elegant text-cream relative overflow-hidden">
            {/* Background Batik Motif Parang Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] grayscale"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-gold text-4xl mb-4">Momen Bahagia</h2>
                    <div className="flex justify-center gap-4 mt-8">
                        <CountdownItem label="Hari" val={timeLeft.days} />
                        <CountdownItem label="Jam" val={timeLeft.hours} />
                        <CountdownItem label="Menit" val={timeLeft.minutes} />
                        <CountdownItem label="Detik" val={timeLeft.seconds} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Akad */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 border-2 border-gold/30 rounded-2xl bg-cream/5 backdrop-blur-sm"
                    >
                        <h3 className="text-gold text-3xl font-script mb-6">Akad Nikah</h3>
                        <div className="space-y-4 text-sm font-light">
                            <div className="flex items-start gap-4">
                                <Calendar className="w-5 h-5 text-gold" />
                                <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <Clock className="w-5 h-5 text-gold" />
                                <span>{data.akad.time}</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-gold mb-1">{data.akad.location}</p>
                                    <p className="text-xs opacity-70 leading-relaxed">{data.akad.address}</p>
                                </div>
                            </div>
                        </div>
                        <a href={data.akad.mapUrl} target="_blank" className="mt-8 block bg-gold py-2 rounded-full text-center text-primary text-xs font-semibold uppercase tracking-widest hover:bg-cream transition-all">
                            Buka Google Maps
                        </a>
                    </motion.div>

                    {/* Resepsi */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 border-2 border-gold/30 rounded-2xl bg-cream/5 backdrop-blur-sm"
                    >
                        <h3 className="text-gold text-3xl font-script mb-6">Resepsi</h3>
                        <div className="space-y-4 text-sm font-light">
                            <div className="flex items-start gap-4">
                                <Calendar className="w-5 h-5 text-gold" />
                                <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <Clock className="w-5 h-5 text-gold" />
                                <span>{data.resepsi.time}</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-gold mb-1">{data.resepsi.location}</p>
                                    <p className="text-xs opacity-70 leading-relaxed">{data.resepsi.address}</p>
                                </div>
                            </div>
                        </div>
                        <a href={data.resepsi.mapUrl} target="_blank" className="mt-8 block bg-gold py-2 rounded-full text-center text-primary text-xs font-semibold uppercase tracking-widest hover:bg-cream transition-all">
                            Buka Google Maps
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
