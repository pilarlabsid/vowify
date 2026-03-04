'use client';

import { useState, useEffect } from 'react';
import { Loader2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboard } from '../dashboard-context';
import { EmptyState, SelectWeddingPrompt } from '../components';

export default function GreetingsPage() {
    const { selectedWedding: wedding, loading: ctxLoading } = useDashboard();
    const [greetings, setGreetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!wedding) return;
        setLoading(true);
        fetch(`/api/greetings?weddingId=${wedding.id}`)
            .then(r => r.json())
            .then(d => setGreetings(d.greetings || []))
            .finally(() => setLoading(false));
    }, [wedding]);

    if (ctxLoading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
    if (!wedding) return <SelectWeddingPrompt />;

    return (
        <div className="space-y-4">
            {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gold" /></div>
            ) : greetings.length === 0 ? (
                <EmptyState title="Belum ada ucapan" desc="Ucapan dari tamu akan muncul di sini setelah mereka mengisi form undangan." />
            ) : (
                greetings.map((g) => (
                    <motion.div
                        key={g.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl p-6 border shadow-sm"
                        style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center font-bold text-gold shrink-0">
                                {g.name[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-semibold" style={{ color: 'var(--ui-text-primary)' }}>{g.name}</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                        style={g.status === 'Hadir' ? {
                                            background: 'color-mix(in srgb, #10B981 12%, transparent)',
                                            color: '#059669',
                                            border: '1px solid color-mix(in srgb, #10B981 25%, transparent)',
                                        } : {
                                            background: 'var(--ui-badge-bg)',
                                            color: 'var(--ui-text-muted)',
                                            border: '1px solid var(--ui-border)',
                                        }}>
                                        {g.status}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed italic" style={{ color: 'var(--ui-text-secondary)' }}>"{g.message}"</p>
                                <p className="text-xs mt-2" style={{ color: 'var(--ui-text-muted)' }}>
                                    {new Date(g.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );
}
