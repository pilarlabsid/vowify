'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Heart, MessageSquare, UserCheck, Loader2,
    TrendingUp, Mail, Send, ShieldOff, Globe, EyeOff,
    ArrowRight, Activity
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
    totalUsers: number;
    verifiedUsers: number;
    blockedUsers: number;
    totalWeddings: number;
    publishedWeddings: number;
    totalGreetings: number;
    totalGuests: number;
    sentGuests: number;
}

function StatCard({ label, value, icon, color, sub, href }: any) {
    const colors: any = {
        gold: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
        blue: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
        emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
        purple: 'bg-purple-500/10 border-purple-500/20 text-purple-500',
        rose: 'bg-rose-500/10 border-rose-500/20 text-rose-500',
        slate: 'bg-slate-500/10 border-slate-500/20 text-slate-500',
        green: 'bg-green-500/10 border-green-500/20 text-green-500',
    };
    const card = (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 border transition-shadow hover:shadow-md"
            style={{
                background: 'var(--ui-bg-card)',
                borderColor: 'var(--ui-border)',
                boxShadow: 'var(--ui-shadow)',
            }}
        >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${colors[color]}`}>
                {icon}
            </div>
            <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--ui-text-primary)' }}>
                {value?.toLocaleString('id-ID') ?? '–'}
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--ui-text-secondary)' }}>{label}</p>
            {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--ui-text-muted)' }}>{sub}</p>}
        </motion.div>
    );
    return href ? <Link href={href}>{card}</Link> : card;
}

function MiniBar({ data }: { data: { date: string; count: number }[] }) {
    const max = Math.max(...data.map(d => d.count), 1);
    return (
        <div className="flex items-end gap-0.5 h-16 w-full">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
                    <div
                        className="w-full bg-gold/30 hover:bg-gold rounded-sm transition-all"
                        style={{ height: `${Math.max((d.count / max) * 100, 4)}%` }}
                        title={`${d.date}: ${d.count} user baru`}
                    />
                </div>
            ))}
        </div>
    );
}

export default function AdminDashboard() {
    const [data, setData] = useState<{
        stats: Stats;
        recentUsers: any[];
        recentActivities: any[];
        themeStats: { theme: string; count: number }[];
        growthData: { date: string; count: number }[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(r => r.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
    }

    const { stats, recentUsers, recentActivities, themeStats, growthData } = data || {
        stats: {} as Stats,
        recentUsers: [],
        recentActivities: [],
        themeStats: [],
        growthData: [],
    };

    const unverifiedUsers = (stats.totalUsers || 0) - (stats.verifiedUsers || 0);
    const sentPct = stats.totalGuests ? Math.round((stats.sentGuests / stats.totalGuests) * 100) : 0;
    const unpublishedWeddings = (stats.totalWeddings || 0) - (stats.publishedWeddings || 0);

    const themeColors: any = {
        javanese: 'bg-amber-400',
        minimalist: 'bg-blue-400',
        elegant: 'bg-purple-400',
    };

    return (
        <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <StatCard label="Total User" value={stats.totalUsers} icon={<Users className="w-5 h-5" />} color="blue" href="/admin/users" />
                <StatCard label="Terverifikasi" value={stats.verifiedUsers} icon={<UserCheck className="w-5 h-5" />} color="emerald"
                    sub={`${unverifiedUsers} belum verifikasi`} href="/admin/users" />
                <StatCard label="User Diblokir" value={stats.blockedUsers} icon={<ShieldOff className="w-5 h-5" />} color="rose" href="/admin/users" />
                <StatCard label="Total Undangan" value={stats.totalWeddings} icon={<Heart className="w-5 h-5" />} color="gold"
                    sub={`${unpublishedWeddings} tidak dipublikasi`} href="/admin/weddings" />
                <StatCard label="Dipublikasi" value={stats.publishedWeddings} icon={<Globe className="w-5 h-5" />} color="green" href="/admin/weddings" />
                <StatCard label="Tidak Publik" value={unpublishedWeddings} icon={<EyeOff className="w-5 h-5" />} color="slate" href="/admin/weddings" />
                <StatCard label="Total Tamu" value={stats.totalGuests} icon={<Mail className="w-5 h-5" />} color="purple"
                    sub={`${sentPct}% sudah terkirim`} />
                <StatCard label="WA Terkirim" value={stats.sentGuests} icon={<Send className="w-5 h-5" />} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth chart */}
                <div
                    className="lg:col-span-2 rounded-2xl p-6 border"
                    style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)', boxShadow: 'var(--ui-shadow)' }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold flex items-center gap-2 text-sm" style={{ color: 'var(--ui-text-primary)' }}>
                            <Activity className="w-4 h-4 text-gold" />
                            Pertumbuhan User (30 hari terakhir)
                        </h2>
                        <span className="text-xs" style={{ color: 'var(--ui-text-muted)' }}>
                            +{growthData.reduce((s, d) => s + d.count, 0)} user baru
                        </span>
                    </div>
                    {growthData.length > 0 && <MiniBar data={growthData} />}
                    <div className="flex justify-between text-[10px] mt-2" style={{ color: 'var(--ui-text-muted)' }}>
                        <span>{growthData[0]?.date.slice(5)}</span>
                        <span>{growthData[growthData.length - 1]?.date.slice(5)}</span>
                    </div>
                </div>

                {/* Theme popularity */}
                <div
                    className="rounded-2xl p-6 border"
                    style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)', boxShadow: 'var(--ui-shadow)' }}
                >
                    <h2 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--ui-text-primary)' }}>
                        <Heart className="w-4 h-4 text-gold" />
                        Tema Terpopuler
                    </h2>
                    <div className="space-y-3">
                        {themeStats.map((t) => {
                            const total = themeStats.reduce((s, x) => s + x.count, 0);
                            const pct = total ? Math.round((t.count / total) * 100) : 0;
                            return (
                                <div key={t.theme}>
                                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--ui-text-secondary)' }}>
                                        <span className="capitalize font-medium">{t.theme}</span>
                                        <span>{t.count} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--ui-bg-hover)' }}>
                                        <div
                                            className={`h-full rounded-full ${themeColors[t.theme] || 'bg-neutral-400'}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {themeStats.length === 0 && (
                            <p className="text-sm text-center py-4" style={{ color: 'var(--ui-text-muted)' }}>Belum ada data</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div
                    className="rounded-2xl overflow-hidden border"
                    style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)', boxShadow: 'var(--ui-shadow)' }}
                >
                    <div
                        className="px-6 py-4 border-b flex items-center justify-between"
                        style={{ borderColor: 'var(--ui-divider)' }}
                    >
                        <h2 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--ui-text-primary)' }}>
                            <TrendingUp className="w-4 h-4 text-gold" />
                            User Terbaru
                        </h2>
                        <Link href="/admin/users" className="text-xs text-gold hover:text-amber-500 flex items-center gap-1">
                            Lihat semua <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div>
                        {recentUsers.map((u: any) => (
                            <div
                                key={u.id}
                                className="px-6 py-3 flex items-center gap-3 border-b"
                                style={{ borderColor: 'var(--ui-divider)' }}
                            >
                                <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold text-xs shrink-0">
                                    {u.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate" style={{ color: 'var(--ui-text-primary)' }}>{u.name}</p>
                                    <p className="text-xs truncate" style={{ color: 'var(--ui-text-secondary)' }}>{u.email}</p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {u.role === 'admin' && (
                                        <span className="px-1.5 py-0.5 bg-gold/10 text-gold border border-gold/20 text-[9px] font-bold rounded-full">ADMIN</span>
                                    )}
                                    {u.isBlocked && (
                                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full border"
                                            style={{ background: 'color-mix(in srgb, #EF4444 12%, transparent)', color: '#EF4444', borderColor: 'color-mix(in srgb, #EF4444 25%, transparent)' }}>BLOKIR</span>
                                    )}
                                    <span className={`w-2 h-2 rounded-full`}
                                        style={{ background: u.emailVerified ? '#10B981' : 'var(--ui-border)' }}
                                        title={u.emailVerified ? 'Terverifikasi' : 'Belum'} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Weddings + Quick Actions */}
                <div className="space-y-4">
                    <div
                        className="rounded-2xl overflow-hidden border"
                        style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)', boxShadow: 'var(--ui-shadow)' }}
                    >
                        <div
                            className="px-6 py-4 border-b flex items-center justify-between"
                            style={{ borderColor: 'var(--ui-divider)' }}
                        >
                            <h2 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--ui-text-primary)' }}>
                                <Heart className="w-4 h-4 text-gold" />
                                Undangan Terbaru
                            </h2>
                            <Link href="/admin/weddings" className="text-xs text-gold hover:text-amber-500 flex items-center gap-1">
                                Lihat semua <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div>
                            {recentActivities.map((w: any) => (
                                <div
                                    key={w.id}
                                    className="px-6 py-3 flex items-center gap-3 border-b"
                                    style={{ borderColor: 'var(--ui-divider)' }}
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--ui-text-primary)' }}>
                                            {w.groomShort} & {w.brideShort}
                                        </p>
                                        <p className="text-xs truncate" style={{ color: 'var(--ui-text-muted)' }}>
                                            by {w.user?.name || 'Unknown'} · /{w.slug}
                                        </p>
                                    </div>
                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full border shrink-0"
                                        style={w.isPublished ? {
                                            background: 'color-mix(in srgb, #10B981 10%, transparent)',
                                            color: '#059669',
                                            borderColor: 'color-mix(in srgb, #10B981 25%, transparent)',
                                        } : {
                                            background: 'var(--ui-badge-bg)',
                                            color: 'var(--ui-text-muted)',
                                            borderColor: 'var(--ui-border)',
                                        }}>
                                        {w.isPublished ? 'Publik' : 'Draft'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div
                        className="rounded-2xl p-5 border"
                        style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)', boxShadow: 'var(--ui-shadow)' }}
                    >
                        <h2 className="font-bold text-sm mb-3" style={{ color: 'var(--ui-text-primary)' }}>⚡ Aksi Cepat</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: 'Kelola User', href: '/admin/users', color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20' },
                                { label: 'Undangan', href: '/admin/weddings', color: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20' },
                                { label: 'Pengaturan', href: '/admin/settings', color: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20' },
                                { label: 'Prisma Studio', href: 'http://localhost:51212', color: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20', external: true },
                            ].map(a => (
                                <a key={a.href} href={a.href} target={a.external ? '_blank' : undefined}
                                    className={`flex items-center justify-center py-3 px-3 rounded-xl text-sm font-bold transition-all text-center ${a.color}`}>
                                    {a.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
