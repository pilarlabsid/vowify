'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, MessageSquare, CheckCircle } from "lucide-react";

interface Greeting {
    name: string;
    status: string;
    message: string;
    date: string;
}

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
                const saved = json.greeting;
                setGreetings([
                    { ...saved, date: 'Baru saja' },
                    ...greetings,
                ]);
                setIsSent(true);
                setFormData({ name: '', status: 'Hadir', message: '' });
                setTimeout(() => setIsSent(false), 3000);
            }
        } catch (err) {
            console.error('Submit greeting error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-24 px-6 bg-cream">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
                {/* RSVP Form */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-elegant p-8 rounded-3xl shadow-2xl relative overflow-hidden"
                >
                    {/* Form Ornament Overlay */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none translate-x-12 -translate-y-12 bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')] grayscale"></div>

                    <h2 className="text-gold text-3xl font-script mb-8">Konfirmasi Kehadiran</h2>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-gold text-xs uppercase tracking-widest font-semibold ml-2">Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50" />
                                <input
                                    type="text"
                                    placeholder="Masukkan nama Anda"
                                    className="w-full bg-white/5 border border-gold/20 text-cream rounded-xl py-4 pl-12 pr-4 focus:border-gold outline-none transition-all placeholder:text-cream/20"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gold text-xs uppercase tracking-widest font-semibold ml-2">Kehadiran</label>
                            <select
                                className="w-full bg-white/5 border border-gold/20 text-cream rounded-xl py-4 px-4 focus:border-gold outline-none transition-all appearance-none"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Hadir" className="bg-elegant text-cream">Hadir</option>
                                <option value="Tidak Hadir" className="bg-elegant text-cream">Tidak Hadir</option>
                                <option value="Masih Ragu" className="bg-elegant text-cream">Masih Ragu</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gold text-xs uppercase tracking-widest font-semibold ml-2">Ucapan & Doa</label>
                            <div className="relative">
                                <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gold/50" />
                                <textarea
                                    rows={4}
                                    placeholder="Tuliskan pesan Anda"
                                    className="w-full bg-white/5 border border-gold/20 text-cream rounded-xl py-4 pl-12 pr-4 focus:border-gold outline-none transition-all placeholder:text-cream/20 resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSent}
                            className="w-full bg-gold py-4 rounded-xl text-primary font-bold uppercase tracking-widest hover:bg-cream hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:bg-gold/50 disabled:cursor-not-allowed group"
                        >
                            <AnimatePresence mode="wait">
                                {isSent ? (
                                    <motion.div
                                        key="sent"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" /> Terkirim!
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="send"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex items-center gap-2 group-hover:scale-105"
                                    >
                                        <Send className="w-5 h-5" /> Kirim RSVP
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </form>
                </motion.div>

                {/* Greetings List */}
                <div className="flex flex-col h-full bg-elegant/5 rounded-3xl p-8 border border-gold/10 relative overflow-hidden">
                    {/* List Ornament */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')] grayscale"></div>

                    <h2 className="text-primary text-3xl font-script mb-8">Ucapan & Doa ({greetings.length})</h2>

                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide max-h-[500px] relative z-10">
                        {greetings.map((g, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-2xl border-l-[6px] border-gold shadow-sm hover:shadow-md transition-shadow group shrink-0"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-serif font-bold text-lg text-primary group-hover:text-gold transition-colors">{g.name}</h4>
                                    <span className="text-[10px] uppercase font-bold text-white bg-gold/80 px-2 py-1 rounded-full">{g.status}</span>
                                </div>
                                <p className="text-elegant/80 text-sm leading-relaxed mb-3 italic">"{g.message}"</p>
                                <span className="text-[10px] text-elegant/40 uppercase tracking-widest flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {g.date}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

const Clock = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
