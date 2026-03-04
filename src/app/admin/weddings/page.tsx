'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, RefreshCw, Trash2, Eye, Loader2, Calendar,
    Globe, EyeOff, Users, MessageSquare, Filter, Download
} from 'lucide-react';
import Link from 'next/link';

interface Wedding {
    id: string;
    slug: string;
    brideName: string;
    groomName: string;
    brideShort: string;
    groomShort: string;
    themeId: string;
    date: string;
    isPublished: boolean;
    createdAt: string;
    user: { name: string; email: string } | null;
    _count: { greetings: number; guests: number };
    akadLocation: string;
}

function ConfirmModal({ title, desc, confirmLabel, confirmColor, onConfirm, onCancel, loading }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-3xl shadow-2xl p-7 w-full max-w-sm z-10"
                style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)' }}>
                <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${confirmColor.includes('red') ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                        <Trash2 className={`w-7 h-7 ${confirmColor.includes('red') ? 'text-red-500' : 'text-amber-500'}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg" style={{ color: 'var(--ui-text-primary)' }}>{title}</h3>
                        <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--ui-text-secondary)' }}>{desc}</p>
                    </div>
                    <div className="flex gap-3 w-full pt-1">
                        <button onClick={onCancel} disabled={loading}
                            className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-50"
                            style={{ border: '1px solid var(--ui-border)', color: 'var(--ui-text-secondary)', background: 'var(--ui-bg-hover)' }}>
                            Batal
                        </button>
                        <button onClick={onConfirm} disabled={loading}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-white font-bold text-sm transition-all disabled:opacity-50 ${confirmColor}`}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function AdminWeddingsPage() {
    const [weddings, setWeddings] = useState<Wedding[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [filterPublished, setFilterPublished] = useState<'' | 'true' | 'false'>('');
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Wedding | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchWeddings = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), search });
            if (filterPublished !== '') params.set('published', filterPublished);
            const res = await fetch(`/api/admin/weddings?${params}`);
            const data = await res.json();
            setWeddings(data.weddings || []);
            setTotal(data.total || 0);
        } finally {
            setLoading(false);
        }
    }, [page, search, filterPublished]);

    useEffect(() => { fetchWeddings(); }, [fetchWeddings]);

    const togglePublish = async (w: Wedding) => {
        setTogglingId(w.id);
        try {
            const res = await fetch('/api/admin/weddings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: w.id, isPublished: !w.isPublished }),
            });
            if (res.ok) {
                setWeddings(prev => prev.map(x => x.id === w.id ? { ...x, isPublished: !x.isPublished } : x));
            }
        } finally {
            setTogglingId(null);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch('/api/admin/weddings', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deleteTarget.id }),
            });
            if (res.ok) {
                setWeddings(prev => prev.filter(x => x.id !== deleteTarget.id));
                setTotal(t => t - 1);
                setDeleteTarget(null);
            }
        } finally {
            setDeleting(false);
        }
    };

    const themeColors: any = {
        javanese: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        minimalist: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        elegant: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };

    return (
        <div className="space-y-5">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 flex-1 min-w-[200px] max-w-sm"
                    style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)', boxShadow: 'var(--ui-shadow)' }}>
                    <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--ui-text-muted)' }} />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Cari nama pengantin atau slug..."
                        className="bg-transparent text-sm focus:outline-none flex-1"
                        style={{ color: 'var(--ui-text-primary)' }}
                    />
                </div>

                {/* Filter publish */}
                <div className="flex items-center rounded-xl p-1 gap-1"
                    style={{ background: 'var(--ui-bg-hover)' }}>
                    <Filter className="w-3.5 h-3.5 ml-2" style={{ color: 'var(--ui-text-muted)' }} />
                    {([['', 'Semua'], ['true', 'Publik'], ['false', 'Draft']] as const).map(([val, label]) => (
                        <button key={val} onClick={() => { setFilterPublished(val); setPage(1); }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            style={filterPublished === val ? {
                                background: 'var(--ui-bg-card)',
                                color: 'var(--ui-text-primary)',
                                boxShadow: 'var(--ui-shadow)',
                            } : {
                                color: 'var(--ui-text-muted)',
                            }}>
                            {label}
                        </button>
                    ))}
                </div>

                <button onClick={fetchWeddings}
                    className="p-2.5 rounded-xl transition-colors hover:text-gold"
                    style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)', boxShadow: 'var(--ui-shadow)', color: 'var(--ui-text-secondary)' }}>
                    <RefreshCw className="w-4 h-4" />
                </button>

                <a href="/api/admin/export/weddings" download
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:text-gold transition-all border"
                    style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)', boxShadow: 'var(--ui-shadow)', color: 'var(--ui-text-secondary)' }}>
                    <Download className="w-4 h-4" />
                    Export CSV
                </a>

                <span className="text-sm ml-auto" style={{ color: 'var(--ui-text-secondary)' }}>{total} undangan</span>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>
            ) : weddings.length === 0 ? (
                <div className="text-center py-20" style={{ color: 'var(--ui-text-muted)' }}>Tidak ada undangan ditemukan</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {weddings.map((w, i) => (
                            <motion.div key={w.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.03 }}
                                className="rounded-2xl p-5 transition-colors group"
                                style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)', boxShadow: 'var(--ui-shadow)' }}>

                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold truncate" style={{ color: 'var(--ui-text-primary)' }}>{w.groomShort} & {w.brideShort}</h3>
                                        <p className="text-xs mt-0.5 font-mono truncate" style={{ color: 'var(--ui-text-muted)' }}>/{w.slug}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border shrink-0 ml-2 ${themeColors[w.themeId] || 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'}`}>
                                        {w.themeId}
                                    </span>
                                </div>

                                {/* Meta */}
                                <div className="space-y-1.5 mb-3">
                                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--ui-text-secondary)' }}>
                                        <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--ui-text-muted)' }} />
                                        {new Date(w.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--ui-text-secondary)' }}>
                                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{w._count.greetings} ucapan</span>
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{w._count.guests} tamu</span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid var(--ui-border)' }}>
                                    <p className="text-[11px] flex-1 truncate" style={{ color: 'var(--ui-text-muted)' }}>
                                        oleh {w.user?.name || 'Unknown'}
                                    </p>

                                    {/* Publish toggle */}
                                    <button
                                        onClick={() => togglePublish(w)}
                                        disabled={togglingId === w.id}
                                        title={w.isPublished ? 'Sembunyikan' : 'Publikasikan'}
                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${w.isPublished
                                            ? 'bg-emerald-500/10 text-emerald-500 hover:bg-red-500/10 hover:text-red-500'
                                            : 'bg-neutral-500/10 text-neutral-400 hover:bg-emerald-500/10 hover:text-emerald-500'}`}
                                    >
                                        {togglingId === w.id
                                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            : w.isPublished
                                                ? <><Globe className="w-3.5 h-3.5" /> Publik</>
                                                : <><EyeOff className="w-3.5 h-3.5" /> Draft</>
                                        }
                                    </button>

                                    <Link href={`/${w.slug}`} target="_blank"
                                        className="p-1.5 rounded-lg transition-all hover:text-blue-400 hover:bg-blue-500/10"
                                        style={{ color: 'var(--ui-text-muted)' }} title="Lihat">
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                    <button onClick={() => setDeleteTarget(w)}
                                        className="p-1.5 rounded-lg transition-all hover:text-red-500 hover:bg-red-500/10"
                                        style={{ color: 'var(--ui-text-muted)' }} title="Hapus">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Pagination */}
            {total > 20 && (
                <div className="flex justify-center gap-2">
                    {Array.from({ length: Math.ceil(total / 20) }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)}
                            className="w-9 h-9 rounded-xl text-sm font-medium transition-all"
                            style={page === p ? {
                                background: '#C6A75E',
                                color: '#1C1612',
                            } : {
                                background: 'var(--ui-bg-card)',
                                border: '1px solid var(--ui-border)',
                                color: 'var(--ui-text-secondary)',
                                boxShadow: 'var(--ui-shadow)',
                            }}>
                            {p}
                        </button>
                    ))}
                </div>
            )}

            {/* Delete confirm modal */}
            <AnimatePresence>
                {deleteTarget && (
                    <ConfirmModal
                        title="Hapus Undangan?"
                        desc={<>Undangan <strong className="text-red-500">{deleteTarget.groomShort} & {deleteTarget.brideShort}</strong> akan dihapus permanen beserta semua data tamu dan ucapan.</>}
                        confirmLabel="Hapus Permanen"
                        confirmColor="bg-red-500 hover:bg-red-600"
                        loading={deleting}
                        onConfirm={confirmDelete}
                        onCancel={() => setDeleteTarget(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
