'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
    Loader2, UserPlus, Send, Trash2, Check, X,
    MessageCircle, Users, Phone, ChevronDown,
    RefreshCw, Search, Edit2, Eye, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../dashboard-context';
import { EmptyState, SelectWeddingPrompt, StatCard } from '../components';

interface Guest {
    id: string;
    name: string;
    phone: string;
    note?: string;
    sent: boolean;
    sentAt?: string;
    createdAt: string;
}

const DEFAULT_TEMPLATE =
    `Assalamualaikum Warahmatullahi Wabarakatuh\n\n` +
    `Kepada Yth.\nBapak/Ibu/Saudara/i *{nama}*\n\n` +
    `Dengan segala kerendahan hati, kami mengundang Anda untuk hadir dan memberikan doa restu dalam acara pernikahan kami:\n\n` +
    `💍 *{mempelai}*\n\n` +
    `Berikut link undangan digital untuk Anda:\n` +
    `👇 {link}\n\n` +
    `Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\n\n` +
    `Wassalamualaikum Warahmatullahi Wabarakatuh\n` +
    `— {mempelai}`;

function buildMessage(template: string, name: string, link: string, mempelai: string): string {
    return template
        .replace(/\{nama\}/g, name)
        .replace(/\{link\}/g, link)
        .replace(/\{mempelai\}/g, mempelai);
}

function MessageTemplateEditor({
    template, setTemplate, groomShort, brideShort, slug
}: {
    template: string;
    setTemplate: (t: string) => void;
    groomShort: string;
    brideShort: string;
    slug: string;
}) {
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savedOk, setSavedOk] = useState(false);
    const mempelai = `${groomShort} & ${brideShort}`;
    const previewLink = typeof window !== 'undefined' ? `${window.location.origin}/${slug}?to=Budi+Santoso` : `…/${slug}?to=Budi+Santoso`;
    const preview = buildMessage(template, 'Budi Santoso', previewLink, mempelai);

    const insertVar = (v: string) => setTemplate(template + `{${v}}`);

    const handleSave = async () => {
        setSaving(true);
        setSavedOk(false);
        try {
            await fetch('/api/user/wa-template', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ waTemplate: template }),
            });
            setSavedOk(true);
            setTimeout(() => setSavedOk(false), 2500);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        setTemplate(DEFAULT_TEMPLATE);
    };

    return (
        <div className="rounded-3xl p-6 border shadow-sm space-y-4"
            style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
            <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--ui-text-primary)' }}>
                    <Edit2 className="w-5 h-5 text-gold" />
                    Template Pesan WhatsApp
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowPreview(v => !v)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border"
                        style={showPreview
                            ? { background: 'color-mix(in srgb, #C6A75E 12%, transparent)', borderColor: 'color-mix(in srgb, #C6A75E 30%, transparent)', color: 'var(--ui-text-primary)' }
                            : { borderColor: 'var(--ui-border)', color: 'var(--ui-text-muted)' }}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        title="Reset ke template default"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all hover:text-red-500"
                        style={{ borderColor: 'var(--ui-border)', color: 'var(--ui-text-muted)' }}
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${savedOk
                            ? 'bg-emerald-500 text-white border border-emerald-500'
                            : 'bg-gold text-primary hover:bg-amber-400 border border-gold/50'
                            } disabled:opacity-60`}
                    >
                        {saving ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : savedOk ? (
                            <Check className="w-3.5 h-3.5" />
                        ) : null}
                        {savedOk ? 'Tersimpan!' : 'Simpan'}
                    </button>
                </div>
            </div>

            {/* Variable chips */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium" style={{ color: 'var(--ui-text-muted)' }}>Variabel:</span>
                {[['nama', 'Nama tamu'], ['mempelai', 'Nama mempelai'], ['link', 'Link undangan']].map(([v, label]) => (
                    <button
                        key={v}
                        type="button"
                        onClick={() => insertVar(v)}
                        className="px-2.5 py-1 bg-gold/10 text-primary border border-gold/20 rounded-lg text-xs font-mono font-bold hover:bg-gold/20 transition-all"
                        title={label}
                    >
                        {`{${v}}`}
                    </button>
                ))}
                <span className="text-xs ml-1" style={{ color: 'var(--ui-text-muted)' }}>Klik variabel untuk menyisipkan ke teks</span>
            </div>

            <textarea
                value={template}
                onChange={e => setTemplate(e.target.value)}
                rows={8}
                className="w-full rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none transition-all resize-y leading-relaxed border"
                style={{
                    background: 'var(--ui-input-bg)',
                    borderColor: 'var(--ui-input-border)',
                    color: 'var(--ui-text-primary)',
                }}
                placeholder="Tulis template pesan..."
            />

            {showPreview && (
                <div className="rounded-2xl p-4 border"
                    style={{ background: 'color-mix(in srgb, #10B981 8%, transparent)', borderColor: 'color-mix(in srgb, #10B981 25%, transparent)' }}>
                    <p className="text-xs font-bold mb-2" style={{ color: '#059669' }}>Preview (contoh untuk tamu "Budi Santoso")</p>
                    <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed break-all" style={{ color: 'var(--ui-text-secondary)' }}>{preview}</pre>
                </div>
            )}
        </div>
    );
}



function buildWhatsAppUrl(phone: string, message: string) {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
}


const COUNTRY_CODES = [
    { code: '62', flag: '🇮🇩', name: 'Indonesia' },
    { code: '60', flag: '🇲🇾', name: 'Malaysia' },
    { code: '65', flag: '🇸🇬', name: 'Singapura' },
    { code: '673', flag: '🇧🇳', name: 'Brunei' },
    { code: '63', flag: '🇵🇭', name: 'Filipina' },
    { code: '66', flag: '🇹🇭', name: 'Thailand' },
    { code: '84', flag: '🇻🇳', name: 'Vietnam' },
    { code: '855', flag: '🇰🇭', name: 'Kamboja' },
    { code: '856', flag: '🇱🇦', name: 'Laos' },
    { code: '95', flag: '🇲🇲', name: 'Myanmar' },
    { code: '1', flag: '🇺🇸', name: 'Amerika Serikat' },
    { code: '44', flag: '🇬🇧', name: 'Inggris' },
    { code: '61', flag: '🇦🇺', name: 'Australia' },
    { code: '81', flag: '🇯🇵', name: 'Jepang' },
    { code: '82', flag: '🇰🇷', name: 'Korea Selatan' },
    { code: '86', flag: '🇨🇳', name: 'China' },
    { code: '91', flag: '🇮🇳', name: 'India' },
    { code: '971', flag: '🇦🇪', name: 'Uni Emirat Arab' },
    { code: '966', flag: '🇸🇦', name: 'Arab Saudi' },
    { code: '974', flag: '🇶🇦', name: 'Qatar' },
];

function normalizeLocalNumber(num: string): string {
    // Remove spaces, dashes, dots
    let n = num.replace(/[\s\-\.]/g, '');
    // Remove leading 0 (e.g. 08123 → 8123)
    if (n.startsWith('0')) n = n.slice(1);
    // Remove leading + if somehow entered
    if (n.startsWith('+')) n = n.slice(1);
    return n;
}

function ConfirmDeleteModal({
    name, onConfirm, onCancel, loading
}: {
    name: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}) {
    // Render via portal → always a direct child of <body>, never inside <tbody>
    if (typeof document === 'undefined') return null;
    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={onCancel}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="relative rounded-3xl shadow-2xl p-7 w-full max-w-sm z-10 border"
                    style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}
                >
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{ background: 'color-mix(in srgb, #EF4444 12%, transparent)' }}>
                            <Trash2 className="w-7 h-7 text-red-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg" style={{ color: 'var(--ui-text-primary)' }}>Hapus Tamu?</h3>
                            <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--ui-text-secondary)' }}>
                                Tamu <span className="font-bold text-red-500">{name}</span> akan dihapus
                                dari daftar undangan secara permanen.
                            </p>
                        </div>
                        <div className="flex gap-3 w-full pt-1">
                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="flex-1 px-4 py-3 rounded-2xl border font-bold text-sm transition-all disabled:opacity-50"
                                style={{ borderColor: 'var(--ui-border)', color: 'var(--ui-text-secondary)', background: 'var(--ui-bg-hover)' }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Hapus
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}

function AddGuestForm({ weddingId, onSuccess }: { weddingId: string; onSuccess: () => void }) {
    const [form, setForm] = useState({ name: '', localPhone: '', note: '' });
    const [countryCode, setCountryCode] = useState('62');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const localNum = normalizeLocalNumber(form.localPhone);
        if (!localNum) { setError('Nomor WhatsApp tidak valid.'); setLoading(false); return; }
        const fullPhone = `${countryCode}${localNum}`;
        try {
            const res = await fetch('/api/guests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: form.name, phone: fullPhone, note: form.note, weddingId }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Gagal menambah tamu.'); return; }
            setForm({ name: '', localPhone: '', note: '' });
            setCountryCode('62');
            onSuccess();
        } catch {
            setError('Terjadi kesalahan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-3xl p-6 border shadow-sm space-y-4"
            style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
            <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--ui-text-primary)' }}>
                <UserPlus className="w-5 h-5 text-gold" />
                Tambah Tamu Baru
            </h3>
            {error && (
                <p className="text-red-500 text-sm p-3 rounded-xl border"
                    style={{ background: 'color-mix(in srgb, #EF4444 8%, transparent)', borderColor: 'color-mix(in srgb, #EF4444 20%, transparent)' }}>
                    {error}
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ui-text-secondary)' }}>Nama Tamu *</label>
                    <input
                        required value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Budi Santoso"
                        className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all border"
                        style={{ background: 'var(--ui-input-bg)', borderColor: 'var(--ui-input-border)', color: 'var(--ui-text-primary)' }}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ui-text-secondary)' }}>Nomor WhatsApp *</label>
                    <div className="flex gap-2">
                        <div className="relative flex-shrink-0">
                            <div className="flex items-center gap-1 rounded-2xl px-3 py-3 text-sm font-medium pointer-events-none select-none whitespace-nowrap min-w-[70px] border"
                                style={{ background: 'var(--ui-input-bg)', borderColor: 'var(--ui-input-border)', color: 'var(--ui-text-secondary)' }}>
                                <span>+{countryCode}</span>
                                <ChevronDown className="w-3 h-3 ml-0.5" style={{ color: 'var(--ui-text-muted)' }} />
                            </div>
                            <select
                                value={countryCode}
                                onChange={e => setCountryCode(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            >
                                {COUNTRY_CODES.map(c => (
                                    <option key={c.code} value={c.code}>
                                        {c.flag} {c.name} (+{c.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <input
                            required value={form.localPhone}
                            onChange={e => setForm(f => ({ ...f, localPhone: e.target.value }))}
                            placeholder="812-3456-7890"
                            className="flex-1 rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all border"
                            style={{ background: 'var(--ui-input-bg)', borderColor: 'var(--ui-input-border)', color: 'var(--ui-text-primary)' }}
                        />
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ui-text-secondary)' }}>Catatan (opsional)</label>
                    <input
                        value={form.note}
                        onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                        placeholder="Keluarga, Teman kuliah, Rekan kerja, dll."
                        className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all border"
                        style={{ background: 'var(--ui-input-bg)', borderColor: 'var(--ui-input-border)', color: 'var(--ui-text-primary)' }}
                    />
                </div>
            </div>

            <button
                type="submit" disabled={loading}
                className="flex items-center gap-2 bg-gold text-primary px-6 py-3 rounded-full font-bold hover:bg-amber-400 transition-all disabled:opacity-60 text-sm"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Tambahkan Tamu
            </button>
        </form>
    );
}




function GuestRow({
    guest, slug, brideShort, groomShort, template, onMarkSent, onDelete, onRequestDelete,
}: {
    guest: Guest;
    slug: string;
    brideShort: string;
    groomShort: string;
    template: string;
    onMarkSent: (id: string) => void;
    onDelete: (id: string) => void;
    onRequestDelete: (guest: Guest) => void;
}) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const inviteUrl = `${baseUrl}/${slug}?to=${encodeURIComponent(guest.name)}`;
    const mempelai = `${groomShort} & ${brideShort}`;
    const waMessage = buildMessage(template, guest.name, inviteUrl, mempelai);
    const waUrl = buildWhatsAppUrl(guest.phone, waMessage);

    const handleSendWA = () => {
        window.open(waUrl, '_blank');
        if (!guest.sent) {
            onMarkSent(guest.id);
        }
    };

    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onDelete(guest.id);
        } finally {
            setDeleting(false);
        }
    };
    void handleDelete; // unused but kept for API compat

    return (
        <>
            <motion.tr
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="group transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--ui-bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
                <td className="px-6 py-4">
                    <div>
                        <p className="font-semibold" style={{ color: 'var(--ui-text-primary)' }}>{guest.name}</p>
                        {guest.note && <p className="text-xs mt-0.5" style={{ color: 'var(--ui-text-muted)' }}>{guest.note}</p>}
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--ui-text-secondary)' }}>
                        <Phone className="w-3.5 h-3.5 text-gold/60" />
                        <span className="font-mono">+{guest.phone}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    {guest.sent ? (
                        <div className="flex items-center gap-1.5">
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                                style={{ background: 'color-mix(in srgb, #10B981 12%, transparent)', color: '#059669', border: '1px solid color-mix(in srgb, #10B981 25%, transparent)' }}>
                                <Check className="w-3 h-3" /> Terkirim
                            </span>
                            {guest.sentAt && (
                                <span className="text-xs" style={{ color: 'var(--ui-text-muted)' }}>
                                    {new Date(guest.sentAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ background: 'var(--ui-badge-bg)', color: 'var(--ui-text-muted)' }}>
                            Belum Dikirim
                        </span>
                    )}
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSendWA}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${guest.sent
                                ? 'border'
                                : 'bg-[#25D366] text-white hover:bg-[#1da851] shadow-lg shadow-green-500/20'
                                }`}
                            style={guest.sent ? { background: 'var(--ui-bg-hover)', color: 'var(--ui-text-secondary)', borderColor: 'var(--ui-border)' } : {}}
                            title={`Kirim ke ${guest.name} via WhatsApp`}
                        >
                            <MessageCircle className="w-3.5 h-3.5" />
                            {guest.sent ? 'Kirim Ulang' : 'Kirim via WA'}
                        </button>
                        <button
                            onClick={() => onRequestDelete(guest)}
                            disabled={deleting}
                            title="Hapus tamu"
                            className="p-2 rounded-lg transition-all disabled:opacity-50 hover:text-red-500"
                            style={{ color: 'var(--ui-text-muted)' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'color-mix(in srgb, #EF4444 8%, transparent)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                    </div>
                </td>
            </motion.tr>

        </>
    );
}



export default function GuestsPage() {
    const { selectedWedding: wedding, loading: ctxLoading } = useDashboard();
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showTemplateEditor, setShowTemplateEditor] = useState(false);
    const [msgTemplate, setMsgTemplate] = useState(DEFAULT_TEMPLATE);
    const [templateLoaded, setTemplateLoaded] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'sent' | 'unsent'>('all');
    // Modal state — lives here so portal renders outside <table>
    const [pendingDelete, setPendingDelete] = useState<Guest | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Load saved template from DB on mount
    useEffect(() => {
        fetch('/api/user/wa-template')
            .then(r => r.json())
            .then(data => {
                if (data.waTemplate) setMsgTemplate(data.waTemplate);
            })
            .catch(() => { })
            .finally(() => setTemplateLoaded(true));
    }, []);

    const fetchGuests = useCallback(async () => {
        if (!wedding) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/guests?weddingId=${wedding.id}`);
            const text = await res.text();
            if (!text) return;
            const data = JSON.parse(text);
            setGuests(data.guests || []);
        } catch (err) {
            console.error('Failed to fetch guests:', err);
        } finally {
            setLoading(false);
        }
    }, [wedding]);

    useEffect(() => { fetchGuests(); }, [fetchGuests]);

    const markSent = async (id: string) => {
        await fetch(`/api/guests/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sent: true }),
        });
        setGuests(prev => prev.map(g => g.id === id ? { ...g, sent: true, sentAt: new Date().toISOString() } : g));
    };

    const deleteGuest = async (id: string) => {
        await fetch(`/api/guests/${id}`, { method: 'DELETE' });
        setGuests(prev => prev.filter(g => g.id !== id));
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        setDeleting(true);
        try {
            await deleteGuest(pendingDelete.id);
            setPendingDelete(null);
        } finally {
            setDeleting(false);
        }
    };

    const sendAllUnsent = () => {
        const unsent = filtered.filter(g => !g.sent);
        if (unsent.length === 0) return;
        if (!confirm(`Buka ${unsent.length} tab WhatsApp untuk mengirim ke semua tamu yang belum dikirimi?`)) return;
        const mempelai = `${wedding!.groomShort} & ${wedding!.brideShort}`;
        unsent.forEach((g, i) => {
            setTimeout(() => {
                const baseUrl = window.location.origin;
                const inviteUrl = `${baseUrl}/${wedding!.slug}?to=${encodeURIComponent(g.name)}`;
                const msg = buildMessage(msgTemplate, g.name, inviteUrl, mempelai);
                window.open(`https://wa.me/${g.phone}?text=${encodeURIComponent(msg)}`, '_blank');
                markSent(g.id);
            }, i * 500);
        });
    };

    if (ctxLoading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
    if (!wedding) return <SelectWeddingPrompt />;

    const filtered = guests
        .filter(g => {
            if (filter === 'sent') return g.sent;
            if (filter === 'unsent') return !g.sent;
            return true;
        })
        .filter(g =>
            g.name.toLowerCase().includes(search.toLowerCase()) ||
            g.phone.includes(search)
        );

    const sentCount = guests.filter(g => g.sent).length;
    const unsentCount = guests.filter(g => !g.sent).length;

    return (
        <div className="space-y-6">
            {/* Delete Confirm Modal — portal renders into document.body, never inside <tbody> */}
            {pendingDelete && (
                <ConfirmDeleteModal
                    name={pendingDelete.name}
                    loading={deleting}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setPendingDelete(null)}
                />
            )}
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Total Tamu" value={guests.length.toString()} sub="dalam daftar" icon={<Users className="w-5 h-5" />} color="blue" />
                <StatCard label="Terkirim" value={sentCount.toString()} sub="undangan WA" icon={<Check className="w-5 h-5" />} color="emerald" />
                <StatCard label="Belum Kirim" value={unsentCount.toString()} sub="menunggu" icon={<MessageCircle className="w-5 h-5" />} color="gold" />
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="flex items-center gap-2 bg-elegant text-gold border border-gold/30 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gold hover:text-primary transition-all"
                >
                    <UserPlus className="w-4 h-4" />
                    {showForm ? 'Tutup Form' : 'Tambah Tamu'}
                </button>

                <button
                    onClick={() => setShowTemplateEditor(v => !v)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all"
                    style={showTemplateEditor
                        ? { background: 'color-mix(in srgb, #C6A75E 12%, transparent)', borderColor: 'color-mix(in srgb, #C6A75E 30%, transparent)', color: 'var(--ui-text-primary)' }
                        : { borderColor: 'var(--ui-border)', color: 'var(--ui-text-secondary)' }}
                >
                    <Edit2 className="w-4 h-4" />
                    Template Pesan
                </button>

                {unsentCount > 0 && (
                    <button
                        onClick={sendAllUnsent}
                        className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1da851] transition-all shadow-lg shadow-green-500/20"
                    >
                        <Send className="w-4 h-4" />
                        Kirim Semua ({unsentCount})
                    </button>
                )}

                <button
                    onClick={fetchGuests}
                    className="p-2.5 rounded-full transition-all hover:text-gold border"
                    style={{ borderColor: 'var(--ui-border)', color: 'var(--ui-text-muted)' }}
                >
                    <RefreshCw className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 rounded-full px-4 py-2.5 ml-auto border"
                    style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
                    <Search className="w-4 h-4" style={{ color: 'var(--ui-text-muted)' }} />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Cari nama atau nomor..."
                        className="text-sm focus:outline-none bg-transparent w-40"
                        style={{ color: 'var(--ui-text-primary)' }}
                    />
                </div>

                <div className="flex rounded-2xl p-1 gap-1 border"
                    style={{ background: 'var(--ui-bg-hover)', borderColor: 'var(--ui-border)' }}>
                    {(['all', 'unsent', 'sent'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                            style={filter === f
                                ? { background: 'var(--ui-bg-card)', color: 'var(--ui-text-primary)', boxShadow: 'var(--ui-shadow)' }
                                : { color: 'var(--ui-text-muted)' }}
                        >
                            {f === 'all' ? 'Semua' : f === 'sent' ? 'Terkirim' : 'Belum'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Add Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <AddGuestForm
                            weddingId={wedding.id}
                            onSuccess={() => { fetchGuests(); setShowForm(false); }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Message Template Editor */}
            <AnimatePresence>
                {showTemplateEditor && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <MessageTemplateEditor
                            template={msgTemplate}
                            setTemplate={setMsgTemplate}
                            groomShort={wedding.groomShort}
                            brideShort={wedding.brideShort}
                            slug={wedding.slug}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Guest Table */}
            {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gold" /></div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    title={guests.length === 0 ? "Belum ada daftar tamu" : "Tidak ada tamu yang cocok"}
                    desc={guests.length === 0 ? "Tambahkan tamu untuk mengirimkan undangan digital via WhatsApp." : "Coba ubah filter atau kata kunci pencarian."}
                />
            ) : (
                <div className="rounded-3xl border overflow-hidden shadow-sm"
                    style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
                    <div className="px-6 py-4 border-b flex items-center justify-between"
                        style={{ borderColor: 'var(--ui-divider)' }}>
                        <p className="text-sm font-semibold" style={{ color: 'var(--ui-text-secondary)' }}>{filtered.length} tamu ditampilkan</p>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                            <span className="text-xs" style={{ color: 'var(--ui-text-muted)' }}>Klik tombol hijau untuk kirim via WhatsApp</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b" style={{ background: 'var(--ui-bg-hover)', borderColor: 'var(--ui-divider)' }}>
                                    <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider text-xs" style={{ color: 'var(--ui-text-secondary)' }}>Nama Tamu</th>
                                    <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider text-xs" style={{ color: 'var(--ui-text-secondary)' }}>No. WhatsApp</th>
                                    <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider text-xs" style={{ color: 'var(--ui-text-secondary)' }}>Status</th>
                                    <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider text-xs" style={{ color: 'var(--ui-text-secondary)' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody style={{ borderColor: 'var(--ui-divider)' }} className="divide-y">
                                <AnimatePresence>
                                    {filtered.map(g => (
                                        <GuestRow
                                            key={g.id}
                                            guest={g}
                                            slug={wedding.slug}
                                            brideShort={wedding.brideShort}
                                            groomShort={wedding.groomShort}
                                            template={msgTemplate}
                                            onMarkSent={markSent}
                                            onDelete={deleteGuest}
                                            onRequestDelete={setPendingDelete}
                                        />
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
