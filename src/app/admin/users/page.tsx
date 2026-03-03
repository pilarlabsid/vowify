'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, RefreshCw, Trash2, Check, X, Loader2,
    UserCheck, UserX, Crown, ShieldCheck
} from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    emailVerified: string | null;
    createdAt: string;
    _count: { weddings: number };
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
    const colors: any = {
        gold: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        red: 'bg-red-500/10 text-red-600 border-red-500/20',
        slate: 'bg-neutral-100 text-neutral-400 border-neutral-200',
    };
    return (
        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${colors[color]}`}>
            {children}
        </span>
    );
}

function ActionBtn({ onClick, title, disabled, color, children }: any) {
    const colors: any = {
        amber: 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20',
        emerald: 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20',
        slate: 'text-neutral-400 bg-neutral-100 hover:bg-neutral-200 border-neutral-200',
        red: 'text-red-500 bg-red-500/10 hover:bg-red-500/20 border-red-500/20',
    };
    return (
        <button
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={`p-1.5 rounded-lg border text-xs transition-all disabled:opacity-40 ${colors[color]}`}
        >
            {children}
        </button>
    );
}

function ConfirmDeleteModal({ user, onConfirm, onCancel, loading }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl shadow-2xl p-7 w-full max-w-sm z-10"
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                        <Trash2 className="w-7 h-7 text-red-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-neutral-800 text-lg">Hapus User?</h3>
                        <p className="text-neutral-500 text-sm mt-1.5 leading-relaxed">
                            User <span className="font-bold text-red-500">{user?.name}</span> dan semua
                            undangan miliknya akan dihapus secara permanen.
                        </p>
                    </div>
                    <div className="flex gap-3 w-full pt-1">
                        <button onClick={onCancel} disabled={loading}
                            className="flex-1 px-4 py-3 rounded-2xl border border-neutral-200 text-neutral-600 font-bold text-sm hover:bg-neutral-50 transition-all disabled:opacity-50">
                            Batal
                        </button>
                        <button onClick={onConfirm} disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-50">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Hapus
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users?page=${page}&search=${encodeURIComponent(search)}`);
            const data = await res.json();
            setUsers(data.users || []);
            setTotal(data.total || 0);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const updateUser = async (id: string, payload: any) => {
        setActionLoading(id);
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data.user } : u));
            }
        } finally {
            setActionLoading(null);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/users/${deleteTarget.id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
                setTotal(t => t - 1);
                setDeleteTarget(null);
            }
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-neutral-200 shadow-sm rounded-xl px-4 py-2.5 flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-neutral-400" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Cari nama atau email..."
                        className="bg-transparent text-neutral-900 text-sm focus:outline-none placeholder-neutral-400 flex-1"
                    />
                </div>
                <button onClick={fetchUsers} className="p-2.5 bg-white border border-neutral-200 shadow-sm rounded-xl text-neutral-500 hover:text-gold transition-colors">
                    <RefreshCw className="w-4 h-4" />
                </button>
                <span className="text-neutral-500 text-sm ml-auto">{total} user ditemukan</span>
            </div>

            {/* Table */}
            <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-100 bg-neutral-50/50">
                            <th className="text-left px-6 py-4 text-neutral-500 font-semibold text-xs uppercase tracking-wider">User</th>
                            <th className="text-left px-6 py-4 text-neutral-500 font-semibold text-xs uppercase tracking-wider">Status</th>
                            <th className="text-left px-6 py-4 text-neutral-500 font-semibold text-xs uppercase tracking-wider">Undangan</th>
                            <th className="text-left px-6 py-4 text-neutral-500 font-semibold text-xs uppercase tracking-wider">Bergabung</th>
                            <th className="text-left px-6 py-4 text-neutral-500 font-semibold text-xs uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {loading ? (
                            <tr><td colSpan={5} className="py-16 text-center"><Loader2 className="w-6 h-6 animate-spin text-gold mx-auto" /></td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={5} className="py-16 text-center text-neutral-500">Tidak ada user ditemukan</td></tr>
                        ) : (
                            <AnimatePresence>
                                {users.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-neutral-50/80 transition-colors"
                                    >
                                        {/* User info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${user.role === 'admin' ? 'bg-gold/20 text-gold' : 'bg-neutral-100 text-neutral-600'}`}>
                                                    {user.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-neutral-900 font-medium truncate">{user.name}</p>
                                                    <p className="text-neutral-500 text-xs truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Badges */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {user.role === 'admin' && <Badge color="gold"><Crown className="w-2.5 h-2.5 inline mr-1" />Admin</Badge>}
                                                {user.emailVerified
                                                    ? <Badge color="emerald"><Check className="w-2.5 h-2.5 inline mr-1" />Verified</Badge>
                                                    : <Badge color="slate">Unverified</Badge>}
                                                {user.isBlocked && <Badge color="red"><X className="w-2.5 h-2.5 inline mr-1" />Blocked</Badge>}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="text-neutral-900 font-bold">{user._count.weddings}</span>
                                            <span className="text-neutral-500 text-xs ml-1">undangan</span>
                                        </td>

                                        <td className="px-6 py-4 text-neutral-500 text-xs">
                                            {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>

                                        {/* Actions — always visible */}
                                        <td className="px-6 py-4">
                                            {actionLoading === user.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-gold" />
                                            ) : (
                                                <div className="flex items-center gap-1.5">
                                                    {/* Jadikan / Cabut Admin */}
                                                    <ActionBtn
                                                        onClick={() => updateUser(user.id, { role: user.role === 'admin' ? 'user' : 'admin' })}
                                                        title={user.role === 'admin' ? 'Cabut Admin' : 'Jadikan Admin'}
                                                        color={user.role === 'admin' ? 'amber' : 'slate'}
                                                    >
                                                        <Crown className="w-3.5 h-3.5" />
                                                    </ActionBtn>

                                                    {/* Verifikasi / Batalkan */}
                                                    {user.role !== 'admin' && (
                                                        <ActionBtn
                                                            onClick={() => updateUser(user.id, { emailVerified: !user.emailVerified })}
                                                            title={user.emailVerified ? 'Batalkan Verifikasi' : 'Verifikasi Email'}
                                                            color={user.emailVerified ? 'emerald' : 'slate'}
                                                        >
                                                            <ShieldCheck className="w-3.5 h-3.5" />
                                                        </ActionBtn>
                                                    )}

                                                    {/* Blokir / Buka */}
                                                    <ActionBtn
                                                        onClick={() => updateUser(user.id, { isBlocked: !user.isBlocked })}
                                                        title={user.isBlocked ? 'Buka Blokir' : 'Blokir User'}
                                                        color={user.isBlocked ? 'emerald' : 'slate'}
                                                    >
                                                        {user.isBlocked ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                                                    </ActionBtn>

                                                    {/* Hapus */}
                                                    <ActionBtn
                                                        onClick={() => setDeleteTarget(user)}
                                                        title="Hapus User"
                                                        color="red"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </ActionBtn>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {total > 20 && (
                <div className="flex justify-center gap-2">
                    {Array.from({ length: Math.ceil(total / 20) }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)}
                            className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === p ? 'bg-gold text-primary' : 'bg-white text-neutral-500 hover:text-neutral-900 border border-neutral-200 shadow-sm'}`}>
                            {p}
                        </button>
                    ))}
                </div>
            )}

            {/* Delete confirm modal */}
            <AnimatePresence>
                {deleteTarget && (
                    <ConfirmDeleteModal
                        user={deleteTarget}
                        loading={deleting}
                        onConfirm={confirmDelete}
                        onCancel={() => setDeleteTarget(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
