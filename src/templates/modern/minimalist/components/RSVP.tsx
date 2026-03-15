'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, MessageSquare, CheckCircle, Clock } from "lucide-react";

export default function RSVP({ weddingId }: { weddingId: string }) {
    const [greetings, setGreetings] = useState<any[]>([]);
    const [formData, setFormData] = useState({ name: "", status: "Hadir", message: "" });
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetch(`/api/greetings?weddingId=${weddingId}`)
            .then(r => r.json())
            .then(json => setGreetings(
                (json.greetings ?? []).map((g: any) => ({
                    ...g,
                    date: new Date(g.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                }))
            ))
            .catch(console.error);
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
        <section className="mn-dark pt-20 pb-12 md:py-28 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mn-section-head"
                >
                    <p className="mn-label mb-3" style={{ color: 'var(--mn-sage-light)' }}>Doa &amp; Ucapan</p>
                    <h2>Konfirmasi &amp; Ucapan</h2>
                    <div className="mn-line-group mt-4">
                        <div className="line" style={{ background: 'var(--mn-sage-light)' }} />
                        <div className="dot" style={{ background: 'var(--mn-sage-light)' }} />
                        <div className="line" style={{ background: 'var(--mn-sage-light)' }} />
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-2xl"
                        style={{
                            border: '1px solid rgba(106, 148, 127, 0.18)',
                            background: 'rgba(106, 148, 127, 0.05)',
                        }}
                    >
                        <h3 className="mb-8" style={{
                            fontFamily: 'var(--mn-font-script)',
                            color: 'var(--mn-sage-light)',
                            fontSize: '2rem',
                        }}>
                            Konfirmasi Kehadiran
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="mn-label block" style={{ color: 'var(--mn-text-dim)' }}>Nama Lengkap</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--mn-sage-light)', opacity: 0.7 }} />
                                    <input
                                        type="text"
                                        placeholder="Masukkan nama Anda"
                                        className="pl-11"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="mn-label block" style={{ color: 'var(--mn-text-dim)' }}>Kehadiran</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Hadir">Hadir</option>
                                    <option value="Tidak Hadir">Tidak Hadir</option>
                                    <option value="Masih Ragu">Masih Ragu</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="mn-label block" style={{ color: 'var(--mn-text-dim)' }}>Ucapan &amp; Doa</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4" style={{ color: 'var(--mn-sage-light)', opacity: 0.7 }} />
                                    <textarea
                                        rows={4}
                                        placeholder="Tuliskan pesan Anda"
                                        className="pl-11 resize-none"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSent || isLoading}
                                className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                style={{
                                    background: 'var(--mn-sage-grad)',
                                    color: '#fff',
                                    fontFamily: 'var(--mn-font-body)',
                                    boxShadow: isSent ? 'none' : 'var(--mn-shadow-sage)',
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

                    {/* Greetings */}
                    <div
                        className="flex flex-col p-8 rounded-2xl"
                        style={{
                            border: '1px solid rgba(106, 148, 127, 0.15)',
                            background: 'rgba(106, 148, 127, 0.03)',
                        }}
                    >
                        <h3 className="mb-6" style={{
                            fontFamily: 'var(--mn-font-script)',
                            color: 'var(--mn-sage-light)',
                            fontSize: '2rem',
                        }}>
                            Ucapan &amp; Doa ({greetings.length})
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-3 max-h-[400px] pr-1">
                            {greetings.map((g, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl"
                                    style={{
                                        background: 'rgba(106, 148, 127, 0.07)',
                                        borderLeft: '2px solid var(--mn-sage)',
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-1.5">
                                        <h4 className="text-sm font-semibold" style={{ color: 'var(--mn-text-light)' }}>{g.name}</h4>
                                        <span
                                            className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full"
                                            style={{ background: 'var(--mn-sage)', color: '#fff' }}
                                        >
                                            {g.status}
                                        </span>
                                    </div>
                                    <p className="text-sm italic mb-2 leading-relaxed" style={{ color: 'rgba(242,245,243,0.55)' }}>
                                        &ldquo;{g.message}&rdquo;
                                    </p>
                                    <span className="text-[10px] flex items-center gap-1" style={{ color: 'rgba(242,245,243,0.30)' }}>
                                        <Clock className="w-3 h-3" /> {g.date}
                                    </span>
                                </motion.div>
                            ))}
                            {greetings.length === 0 && (
                                <p className="text-sm italic text-center py-12" style={{ color: 'rgba(242,245,243,0.3)' }}>
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
