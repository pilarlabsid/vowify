'use client';

import { motion } from "framer-motion";
import { MapPin, Clock, CalendarDays, ExternalLink } from "lucide-react";
import { WeddingData } from "@/lib/types";

function EventCard({
    tag, title, date, time, location, address, mapUrl, delay,
}: {
    tag: string; title: string; date: string; time: string;
    location: string; address: string; mapUrl?: string; delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay ?? 0 }}
            className="mn-event-card flex flex-col"
        >
            {/* Tag */}
            <p className="mn-label mb-4">{tag}</p>

            {/* Title */}
            <h3 className="mb-6" style={{ fontSize: '1.75rem' }}>{title}</h3>

            {/* Hairline */}
            <div className="mn-hr-full mb-6" />

            {/* Details */}
            <div className="space-y-4 flex-1">
                <div className="flex items-start gap-3">
                    <CalendarDays className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--mn-sage)' }} />
                    <span className="text-sm" style={{ color: 'var(--mn-text-muted)' }}>{date}</span>
                </div>
                <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--mn-sage)' }} />
                    <span className="text-sm" style={{ color: 'var(--mn-text-muted)' }}>{time}</span>
                </div>
                <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--mn-sage)' }} />
                    <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--mn-text)' }}>{location}</p>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--mn-text-muted)' }}>{address}</p>
                    </div>
                </div>
            </div>

            {/* Map CTA */}
            {mapUrl && (
                <a
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all"
                    style={{
                        border: '1px solid var(--mn-border-sage)',
                        color: 'var(--mn-sage)',
                        background: 'var(--mn-sage-soft)',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--mn-sage)';
                        (e.currentTarget as HTMLElement).style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--mn-sage-soft)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--mn-sage)';
                    }}
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Lihat Lokasi
                </a>
            )}
        </motion.div>
    );
}

export default function Events({ data }: { data: WeddingData }) {
    const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <section className="py-20 md:py-28 px-6" style={{ background: 'var(--mn-bg-alt)' }}>
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mn-section-head"
                >
                    <p className="mn-label mb-3">Rangkaian Acara</p>
                    <h2>The Events</h2>
                    <div className="mn-line-group mt-4">
                        <div className="line" />
                        <div className="dot" />
                        <div className="line" />
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    <EventCard
                        tag="01"
                        title="Akad Nikah"
                        date={formattedDate}
                        time={data.akad.time}
                        location={data.akad.location}
                        address={data.akad.address}
                        mapUrl={data.akad.mapUrl}
                        delay={0}
                    />
                    <EventCard
                        tag="02"
                        title="Resepsi Pernikahan"
                        date={formattedDate}
                        time={data.resepsi.time}
                        location={data.resepsi.location}
                        address={data.resepsi.address}
                        mapUrl={data.resepsi.mapUrl}
                        delay={0.12}
                    />
                </div>
            </div>
        </section>
    );
}
