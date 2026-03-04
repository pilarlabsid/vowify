'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Loader2, Crown, ShieldCheck, UserX, UserCheck,
    Trash2, Heart, Users, MessageSquare, Calendar, Eye, Globe,
    EyeOff, Check, X, RefreshCw, MessageCircle, Shield
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─── Shared style helpers ────────────────────────────────────────────────────
const cardStyle = { background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)', color: 'var(--ui-text-primary)' };
const textPrimary = { color: 'var(--ui-text-primary)' };
const textSecondary = { color: 'var(--ui-text-secondary)' };
const textMuted = { color: 'var(--ui-text-muted)' };
const dividerStyle = { borderColor: 'var(--ui-divider)' };

function StatPill({ icon, label, value, color }: any) {
    const styles: any = {
        blue: { background: 'color-mix(in srgb, #3B82F6 8%, transparent)', color: '#3B82F6', borderColor: 'color-mix(in srgb, #3B82F6 15%, transparent)' },
        emerald: { background: 'color-mix(in srgb, #10B981 8%, transparent)', color: '#10B981', borderColor: 'color-mix(in srgb, #10B981 15%, transparent)' },
        amber: { background: 'color-mix(in srgb, #F59E0B 8%, transparent)', color: '#F59E0B', borderColor: 'color-mix(in srgb, #F59E0B 15%, transparent)' },
        purple: { background: 'color-mix(in srgb, #8B5CF6 8%, transparent)', color: '#8B5CF6', borderColor: 'color-mix(in srgb, #8B5CF6 15%, transparent)' },
    };
    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border" style={styles[color]}>
            {icon}
            <div>
                <p className="text-lg font-bold leading-tight">{value}</p>
                <p className="text-xs opacity-70">{label}</p>
            </div>
        </div>
    );
}

function Badge({ children, color }: any) {
    const styles: any = {
        gold: { background: 'color-mix(in srgb, #C6A75E 12%, transparent)', color: '#C6A75E', borderColor: 'color-mix(in srgb, #C6A75E 25%, transparent)' },
        emerald: { background: 'color-mix(in srgb, #10B981 10%, transparent)', color: '#10B981', borderColor: 'color-mix(in srgb, #10B981 20%, transparent)' },
        red: { background: 'color-mix(in srgb, #EF4444 10%, transparent)', color: '#EF4444', borderColor: 'color-mix(in srgb, #EF4444 20%, transparent)' },
        slate: { background: 'var(--ui-badge-bg)', color: 'var(--ui-text-muted)', borderColor: 'var(--ui-border)' },
    };
    return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full border" style={styles[color]}>
            {children}
        </span>
    );
}

function ActionButton({ onClick, disabled, icon, label, activeStyle, defaultStyle }: any) {
    return (
        <button onClick={onClick} disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-50"
            style={defaultStyle}
            onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, activeStyle)}
            onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, defaultStyle)}
        >
            {icon}
            {label}
        </button>
    );
}

function ConfirmModal({ title, desc, confirmLabel, onConfirm, onCancel, loading }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-3xl shadow-2xl p-7 w-full max-w-sm z-10 border"
                style={cardStyle}>
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ background: 'color-mix(in srgb, #EF4444 12%, transparent)' }}>
                        <Trash2 className="w-7 h-7 text-red-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg" style={textPrimary}>{title}</h3>
                        <p className="text-sm mt-1.5 leading-relaxed" style={textSecondary}>{desc}</p>
                    </div>
                    <div className="flex gap-3 w-full pt-1">
                        <button onClick={onCancel} disabled={loading}
                            className="flex-1 px-4 py-3 rounded-2xl border font-bold text-sm transition-all disabled:opacity-50"
                            style={{ borderColor: 'var(--ui-border)', color: 'var(--ui-text-secondary)', background: 'var(--ui-bg-hover)' }}>
                            Batal
                        </button>
                        <button onClick={onConfirm} disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-50">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

const THEME_STYLES: any = {
    javanese: { background: 'color-mix(in srgb, #F59E0B 12%, transparent)', color: '#B45309', borderColor: 'color-mix(in srgb, #F59E0B 25%, transparent)' },
    minimalist: { background: 'color-mix(in srgb, #3B82F6 10%, transparent)', color: '#1D4ED8', borderColor: 'color-mix(in srgb, #3B82F6 20%, transparent)' },
    elegant: { background: 'color-mix(in srgb, #8B5CF6 10%, transparent)', color: '#6D28D9', borderColor: 'color-mix(in srgb, #8B5CF6 20%, transparent)' },
};

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${id}`);
            const json = await res.json();
            if (res.ok) setData(json);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const updateUser = async (payload: any) => {
        setActionLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (res.ok) setData((prev: any) => ({ ...prev, user: { ...prev.user, ...json.user } }));
        } finally {
            setActionLoading(false);
        }
    };

    const deleteUser = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            if (res.ok) router.push('/admin/users');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20">
                <p style={textSecondary}>User tidak ditemukan.</p>
                <Link href="/admin/users" className="text-gold text-sm mt-2 inline-block">← Kembali</Link>
            </div>
        );
    }

    const { user, totalGuests, totalGreetings } = data;
    const initials = user.name?.[0]?.toUpperCase() || '?';
    const joined = new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const btnBase = { borderColor: 'var(--ui-border)', color: 'var(--ui-text-secondary)', background: 'var(--ui-bg-hover)' };

    return (
        <div className="max-w-4xl space-y-6">
            {/* Back */}
            <Link href="/admin/users"
                className="inline-flex items-center gap-2 text-sm transition-colors hover:text-gold"
                style={textMuted}>
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Manajemen User
            </Link>

            {/* Profile Card */}
            <div className="border rounded-3xl p-6 shadow-sm" style={cardStyle}>
                <div className="flex flex-col sm:flex-row items-start gap-5">
                    {/* Avatar */}
                    <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 ${user.role === 'admin' ? 'bg-gold/20 text-gold' : ''}`}
                        style={user.role !== 'admin' ? { background: 'var(--ui-bg-hover)', color: 'var(--ui-text-secondary)' } : {}}
                    >
                        {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-2 mb-1">
                            <h1 className="text-xl font-bold" style={textPrimary}>{user.name || '(Tidak ada nama)'}</h1>
                            {user.role === 'admin' && <Badge color="gold"><Crown className="w-3 h-3 inline mr-1" />Admin</Badge>}
                            {user.emailVerified ? <Badge color="emerald"><Check className="w-3 h-3 inline mr-1" />Verified</Badge> : <Badge color="slate">Unverified</Badge>}
                            {user.isBlocked && <Badge color="red"><X className="w-3 h-3 inline mr-1" />Blocked</Badge>}
                        </div>
                        <p className="text-sm" style={textMuted}>{user.email}</p>
                        <p className="text-xs mt-1 flex items-center gap-1" style={textMuted}>
                            <Calendar className="w-3.5 h-3.5" />
                            Bergabung {joined}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 sm:ml-auto">
                        {/* Toggle Admin */}
                        <button onClick={() => updateUser({ role: user.role === 'admin' ? 'user' : 'admin' })}
                            disabled={actionLoading}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-50"
                            style={user.role === 'admin'
                                ? { background: 'color-mix(in srgb, #F59E0B 10%, transparent)', color: '#D97706', borderColor: 'color-mix(in srgb, #F59E0B 25%, transparent)' }
                                : btnBase}>
                            <Crown className="w-3.5 h-3.5" />
                            {user.role === 'admin' ? 'Cabut Admin' : 'Jadikan Admin'}
                        </button>

                        {/* Toggle Verify */}
                        <button onClick={() => updateUser({ emailVerified: !user.emailVerified })}
                            disabled={actionLoading}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-50"
                            style={user.emailVerified
                                ? { background: 'color-mix(in srgb, #10B981 10%, transparent)', color: '#059669', borderColor: 'color-mix(in srgb, #10B981 25%, transparent)' }
                                : btnBase}>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {user.emailVerified ? 'Batalkan Verifikasi' : 'Verifikasi'}
                        </button>

                        {/* Toggle Block */}
                        <button onClick={() => updateUser({ isBlocked: !user.isBlocked })}
                            disabled={actionLoading}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-50"
                            style={user.isBlocked
                                ? { background: 'color-mix(in srgb, #10B981 10%, transparent)', color: '#059669', borderColor: 'color-mix(in srgb, #10B981 25%, transparent)' }
                                : btnBase}>
                            {user.isBlocked ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                            {user.isBlocked ? 'Buka Blokir' : 'Blokir'}
                        </button>

                        {/* Delete */}
                        <button onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all"
                            style={{ background: 'color-mix(in srgb, #EF4444 10%, transparent)', color: '#EF4444', borderColor: 'color-mix(in srgb, #EF4444 25%, transparent)' }}>
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus User
                        </button>
                    </div>
                </div>

                {/* Stats row */}
                <div className="mt-5 pt-5 border-t grid grid-cols-2 sm:grid-cols-4 gap-3" style={dividerStyle}>
                    <StatPill icon={<Heart className="w-4 h-4" />} label="Undangan" value={user._count.weddings} color="amber" />
                    <StatPill icon={<Users className="w-4 h-4" />} label="Total Tamu" value={totalGuests} color="blue" />
                    <StatPill icon={<MessageSquare className="w-4 h-4" />} label="Ucapan" value={totalGreetings} color="purple" />
                    <StatPill icon={<Shield className="w-4 h-4" />} label="Template WA" value={user.waTemplate ? 'Custom' : 'Default'} color="emerald" />
                </div>

                {/* Custom WA template preview */}
                {user.waTemplate && (
                    <div className="mt-4 p-4 rounded-2xl border" style={{ background: 'var(--ui-bg-hover)', borderColor: 'var(--ui-border)' }}>
                        <p className="text-xs font-bold mb-2 flex items-center gap-1.5" style={textMuted}>
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                            Template WA Kustom User
                        </p>
                        <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed line-clamp-4" style={textSecondary}>{user.waTemplate}</pre>
                    </div>
                )}
            </div>

            {/* Weddings List */}
            <div className="border rounded-3xl shadow-sm overflow-hidden" style={cardStyle}>
                <div className="px-6 py-5 border-b flex items-center justify-between" style={dividerStyle}>
                    <h2 className="font-bold flex items-center gap-2" style={textPrimary}>
                        <Heart className="w-5 h-5 text-gold" />
                        Undangan ({user._count.weddings})
                    </h2>
                    <button onClick={load}
                        className="p-2 rounded-lg transition-colors hover:text-gold"
                        style={textMuted}>
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                {user.weddings.length === 0 ? (
                    <div className="py-16 text-center text-sm" style={textSecondary}>User belum memiliki undangan.</div>
                ) : (
                    <div>
                        {user.weddings.map((w: any, i: number) => (
                            <motion.div key={w.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="px-6 py-4 flex items-center gap-4 transition-colors"
                                style={{ borderTop: i > 0 ? `1px solid var(--ui-divider)` : 'none' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--ui-bg-hover)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                {/* Theme badge */}
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border"
                                    style={THEME_STYLES[w.themeId] || { background: 'var(--ui-badge-bg)', color: 'var(--ui-text-muted)', borderColor: 'var(--ui-border)' }}>
                                    {w.themeId}
                                </span>

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate" style={textPrimary}>
                                        {w.groomShort} & {w.brideShort}
                                    </p>
                                    <p className="text-xs font-mono truncate" style={textMuted}>/{w.slug}</p>
                                </div>

                                <div className="flex items-center gap-4 text-xs shrink-0" style={textSecondary}>
                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{w._count.guests}</span>
                                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{w._count.greetings}</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(w.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>

                                {/* Publish status */}
                                <span className="px-2 py-1 text-[10px] font-bold rounded-full border"
                                    style={w.isPublished
                                        ? { background: 'color-mix(in srgb, #10B981 10%, transparent)', color: '#059669', borderColor: 'color-mix(in srgb, #10B981 25%, transparent)' }
                                        : { background: 'var(--ui-badge-bg)', color: 'var(--ui-text-muted)', borderColor: 'var(--ui-border)' }}>
                                    {w.isPublished
                                        ? <><Globe className="w-3 h-3 inline mr-0.5" />Publik</>
                                        : <><EyeOff className="w-3 h-3 inline mr-0.5" />Draft</>}
                                </span>

                                <Link href={`/${w.slug}`} target="_blank"
                                    className="p-1.5 rounded-lg transition-all hover:text-gold"
                                    style={textMuted}
                                    title="Lihat undangan">
                                    <Eye className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <ConfirmModal
                        title="Hapus User Ini?"
                        desc={<>User <span className="font-bold text-red-500">{user.name}</span> dan semua {user._count.weddings} undangan miliknya akan dihapus permanen.</>}
                        confirmLabel="Hapus Permanen"
                        loading={deleting}
                        onConfirm={deleteUser}
                        onCancel={() => setShowDeleteModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
