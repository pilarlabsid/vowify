'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, MessageSquare, CheckCircle, Clock } from "lucide-react";
import Image from "next/image";

export default function RSVP({ weddingId }: { weddingId: string }) {
    const [greetings, setGreetings] = useState<any[]>([]);
    const [formData, setFormData] = useState({ name: "", status: "Hadir", message: "" });
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchGreetings = async () => {
            try {
                const res = await fetch(`/api/greetings?weddingId=${weddingId}`);
                const json = await res.json();
                setGreetings((json.greetings ?? []).map((g: any) => ({
                    ...g,
                    date: new Date(g.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                })));
            } catch (err) {
                console.error('Failed to fetch greetings:', err);
            }
        };
        fetchGreetings();
    }, [weddingId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.message) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/greetings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weddingId, ...formData }),
            });
            const json = await res.json();
            if (json.success) {
                setGreetings([{ ...json.greeting, date: 'Baru saja' }, ...greetings]);
                setIsSent(true);
                setFormData({ name: '', status: 'Hadir', message: '' });
                setTimeout(() => setIsSent(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section
            className="py-24 px-6 relative overflow-hidden"
            style={{ background: 'var(--wbg-black)' }}
        >
            {/* Asset 9.x ornamen corner */}
            <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 pointer-events-none opacity-12">
                <Image src="/templates/wayang-black-gold/9.1.webp" alt="Corner TL" fill
                    sizes="192px"
                    className="object-contain object-left-top"
                    style={{ filter: 'sepia(1) saturate(0.3) brightness(0.4) hue-rotate(20deg)' }}
                />
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 pointer-events-none opacity-12">
                <Image src="/templates/wayang-black-gold/9.2.webp" alt="Corner BR" fill
                    sizes="192px"
                    className="object-contain object-right-bottom"
                    style={{ filter: 'sepia(1) saturate(0.3) brightness(0.4) hue-rotate(20deg)' }}
                />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Judul */}
                <div className="text-center mb-12">
                    <p className="wbg-label mb-3">Doa & Ucapan</p>
                    <h2
                        className="text-3xl md:text-4xl"
                        style={{ fontFamily: 'var(--wbg-font-display)', color: 'var(--wbg-gold)' }}
                    >
                        Konfirmasi & Ucapan
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form RSVP */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-2xl relative overflow-hidden"
                        style={{
                            border: '1px solid var(--wbg-border-gold)',
                            background: 'rgba(201,168,76,0.03)',
                        }}
                    >
                        {/* Corner ornaments */}
                        <div className="absolute top-0 left-0 w-10 h-10 border-l border-t opacity-50" style={{ borderColor: 'var(--wbg-gold)' }} />
                        <div className="absolute top-0 right-0 w-10 h-10 border-r border-t opacity-50" style={{ borderColor: 'var(--wbg-gold)' }} />
                        <div className="absolute bottom-0 left-0 w-10 h-10 border-l border-b opacity-50" style={{ borderColor: 'var(--wbg-gold)' }} />
                        <div className="absolute bottom-0 right-0 w-10 h-10 border-r border-b opacity-50" style={{ borderColor: 'var(--wbg-gold)' }} />

                        <h3
                            className="text-2xl mb-8"
                            style={{ fontFamily: 'var(--wbg-font-script)', color: 'var(--wbg-gold)', fontSize: '2rem' }}
                        >
                            Konfirmasi Kehadiran
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="wbg-label block">Nama Lengkap</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" style={{ color: 'var(--wbg-gold)' }} />
                                    <input
                                        type="text"
                                        placeholder="Masukkan nama Anda"
                                        className="w-full py-3.5 pl-11 pr-4 rounded-xl text-sm"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="wbg-label block">Kehadiran</label>
                                <select
                                    className="w-full py-3.5 px-4 rounded-xl text-sm appearance-none"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Hadir" style={{ background: '#111', color: '#F5EDD0' }}>Hadir</option>
                                    <option value="Tidak Hadir" style={{ background: '#111', color: '#F5EDD0' }}>Tidak Hadir</option>
                                    <option value="Masih Ragu" style={{ background: '#111', color: '#F5EDD0' }}>Masih Ragu</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="wbg-label block">Ucapan & Doa</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 opacity-40" style={{ color: 'var(--wbg-gold)' }} />
                                    <textarea
                                        rows={4}
                                        placeholder="Tuliskan pesan Anda"
                                        className="w-full py-3.5 pl-11 pr-4 rounded-xl text-sm resize-none"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSent || isLoading}
                                className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    fontFamily: 'var(--wbg-font-display)',
                                    background: 'var(--wbg-grad-gold)',
                                    color: 'var(--wbg-black)',
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {isSent ? (
                                        <motion.span key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" /> Terkirim!
                                        </motion.span>
                                    ) : (
                                        <motion.span key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                            <Send className="w-4 h-4" /> Kirim RSVP
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </form>
                    </motion.div>

                    {/* Daftar ucapan */}
                    <div
                        className="flex flex-col p-8 rounded-2xl"
                        style={{
                            border: '1px solid var(--wbg-border-gold)',
                            background: 'rgba(201,168,76,0.02)',
                        }}
                    >
                        <h3
                            className="text-2xl mb-6"
                            style={{ fontFamily: 'var(--wbg-font-script)', color: 'var(--wbg-gold)', fontSize: '2rem' }}
                        >
                            Ucapan & Doa ({greetings.length})
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-4 max-h-[400px] pr-1">
                            {greetings.map((g, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl"
                                    style={{
                                        background: 'rgba(201,168,76,0.05)',
                                        borderLeft: '3px solid var(--wbg-gold)',
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4
                                            className="font-semibold text-sm"
                                            style={{ color: 'var(--wbg-text-light)' }}
                                        >
                                            {g.name}
                                        </h4>
                                        <span
                                            className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full"
                                            style={{ background: 'var(--wbg-gold)', color: 'var(--wbg-black)', opacity: 0.85 }}
                                        >
                                            {g.status}
                                        </span>
                                    </div>
                                    <p className="text-sm italic mb-2 leading-relaxed" style={{ color: 'var(--wbg-text-dim)' }}>
                                        "{g.message}"
                                    </p>
                                    <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--wbg-text-dim)', opacity: 0.6 }}>
                                        <Clock className="w-3 h-3" /> {g.date}
                                    </span>
                                </motion.div>
                            ))}

                            {greetings.length === 0 && (
                                <p className="text-sm italic text-center py-8" style={{ color: 'var(--wbg-text-dim)' }}>
                                    Belum ada ucapan. Jadilah yang pertama!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
