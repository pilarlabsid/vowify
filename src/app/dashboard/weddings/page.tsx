'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../dashboard-context';
import { EmptyState, WeddingCard, FormGrid, FormField, TemplateSelector } from '../components';

// Utility: buat slug dari nama mempelai
function generateSlug(bride: string, groom: string): string {
    const toSlug = (s: string) =>
        s.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // hapus diakritik
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
    const b = toSlug(bride);
    const g = toSlug(groom);
    if (!b && !g) return '';
    if (!b) return g;
    if (!g) return b;
    return `${b}-${g}`;
}

function CreateWeddingForm({ onSuccess }: { onSuccess: () => void }) {
    const [form, setForm] = useState({
        slug: '', brideName: '', brideShort: '', brideParents: '',
        groomName: '', groomShort: '', groomParents: '',
        date: '', akadTime: '', akadLocation: '', akadAddress: '',
        resepsiTime: '', resepsiLocation: '', resepsiAddress: '', themeId: 'javanese',
    });
    const [slugEdited, setSlugEdited] = useState(false); // true = user sudah ubah manual
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Auto-generate slug dari nama mempelai (hanya jika belum diedit manual)
    const setField = (k: string) => (e: any) => {
        const val = e.target.value;
        setForm(f => {
            const next = { ...f, [k]: val };
            if (!slugEdited) {
                next.slug = generateSlug(
                    k === 'brideShort' ? val : f.brideShort,
                    k === 'groomShort' ? val : f.groomShort,
                );
            }
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/weddings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Gagal membuat undangan.'); return; }
            onSuccess();
        } catch { setError('Terjadi kesalahan.'); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-3xl p-8 border shadow-sm space-y-6"
            style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
            <h3 className="text-lg font-bold" style={{ color: 'var(--ui-text-primary)' }}>Buat Undangan Baru</h3>
            {error && (
                <p className="text-red-500 text-sm p-3 rounded-xl border"
                    style={{ background: 'color-mix(in srgb, #EF4444 8%, transparent)', borderColor: 'color-mix(in srgb, #EF4444 20%, transparent)' }}>
                    {error}
                </p>
            )}

            <FormGrid>
                <FormField label="Nama Mempelai Wanita *" placeholder="Siti Ratna Sari" value={form.brideName} onChange={setField('brideName')} required />
                <FormField label="Nama Singkat Wanita *" placeholder="Ratna" value={form.brideShort} onChange={setField('brideShort')} required />
                <FormField label="Orang Tua Wanita *" placeholder="Bapak/Ibu ..." value={form.brideParents} onChange={setField('brideParents')} required />
                <FormField label="Nama Mempelai Pria *" placeholder="Aditya Wijaya" value={form.groomName} onChange={setField('groomName')} required />
                <FormField label="Nama Singkat Pria *" placeholder="Aditya" value={form.groomShort} onChange={setField('groomShort')} required />
                <FormField label="Orang Tua Pria *" placeholder="Bapak/Ibu ..." value={form.groomParents} onChange={setField('groomParents')} required />
                <FormField label="Tanggal Pernikahan *" type="datetime-local" value={form.date} onChange={setField('date')} required />
                <FormField label="Waktu Akad *" placeholder="09.00 - 10.00 WIB" value={form.akadTime} onChange={setField('akadTime')} required />
                <FormField label="Lokasi Akad *" placeholder="Masjid ..." value={form.akadLocation} onChange={setField('akadLocation')} required />
                <FormField label="Alamat Akad" placeholder="Jl. ..." value={form.akadAddress} onChange={setField('akadAddress')} />
                <FormField label="Waktu Resepsi *" placeholder="11.00 - 14.00 WIB" value={form.resepsiTime} onChange={setField('resepsiTime')} required />
                <FormField label="Lokasi Resepsi *" placeholder="Gedung ..." value={form.resepsiLocation} onChange={setField('resepsiLocation')} required />
                <FormField label="Alamat Resepsi" placeholder="Jl. ..." value={form.resepsiAddress} onChange={setField('resepsiAddress')} />
                <div className="sm:col-span-2">
                    <TemplateSelector
                        value={form.themeId}
                        onChange={(val) => setForm({ ...form, themeId: val })}
                    />
                </div>

                {/* URL Slug — auto-generated, bisa diedit manual */}
                <div className="sm:col-span-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ui-text-muted)' }}>
                            URL Undangan
                        </label>
                        <button
                            type="button"
                            onClick={() => setSlugEdited(s => !s)}
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-all"
                            style={{ color: slugEdited ? 'var(--color-gold, #c9a96e)' : 'var(--ui-text-muted)', borderColor: slugEdited ? 'rgba(201,169,110,0.3)' : 'var(--ui-border)' }}>
                            {slugEdited ? '✏️ Mode edit' : '✨ Auto'}
                        </button>
                    </div>
                    <div className="flex items-center gap-0 rounded-xl overflow-hidden border"
                        style={{ borderColor: 'var(--ui-input-border)', background: 'var(--ui-input-bg)' }}>
                        <span className="px-3 py-2.5 text-sm border-r shrink-0"
                            style={{ color: 'var(--ui-text-muted)', borderColor: 'var(--ui-input-border)', background: 'var(--ui-bg-hover)' }}>
                            vowify.id/
                        </span>
                        <input
                            value={form.slug}
                            readOnly={!slugEdited}
                            onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                            placeholder="aditya-ratna-2026"
                            className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none"
                            style={{
                                color: 'var(--ui-text-primary)',
                                cursor: slugEdited ? 'text' : 'default',
                                opacity: !slugEdited && !form.slug ? 0.4 : 1,
                            }}
                        />
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--ui-text-muted)' }}>
                        {slugEdited
                            ? 'URL diatur manual. Gunakan huruf kecil, angka, dan tanda hubung saja.'
                            : 'URL dibuat otomatis dari nama mempelai. Klik “Auto” untuk edit manual.'}
                    </p>
                </div>
            </FormGrid>

            <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex items-center gap-2 bg-gold text-primary px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition-all disabled:opacity-60">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Buat Undangan
                </button>
            </div>
        </form>
    );
}

export default function WeddingsPage() {
    const { weddings, selectedWedding, setSelectedWedding, fetchWeddings, loading } = useDashboard();
    const [showForm, setShowForm] = useState(false);

    if (loading) {
        return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-sm" style={{ color: 'var(--ui-text-secondary)' }}>{weddings.length} undangan ditemukan</p>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-elegant text-gold border border-gold/30 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gold hover:text-primary transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Buat Undangan Baru
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <CreateWeddingForm onSuccess={() => { setShowForm(false); fetchWeddings(); }} />
                    </motion.div>
                )}
            </AnimatePresence>

            {weddings.length === 0 ? (
                <EmptyState title="Belum ada undangan" desc="Klik tombol di atas untuk membuat undangan pertama Anda." />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {weddings.map((w) => (
                        <WeddingCard
                            key={w.id}
                            wedding={w}
                            selected={selectedWedding?.id === w.id}
                            onSelect={() => setSelectedWedding(w)}
                            onRefresh={fetchWeddings}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
