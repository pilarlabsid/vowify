'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../dashboard-context';
import { EmptyState, WeddingCard, FormGrid, FormField, TemplateSelector } from '../components';

function CreateWeddingForm({ onSuccess }: { onSuccess: () => void }) {
    const [form, setForm] = useState({
        slug: '', brideName: '', brideShort: '', brideParents: '',
        groomName: '', groomShort: '', groomParents: '',
        date: '', akadTime: '', akadLocation: '', akadAddress: '',
        resepsiTime: '', resepsiLocation: '', resepsiAddress: '', themeId: 'javanese',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }));

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
                <FormField label="URL Slug *" placeholder="aditya-ratna" value={form.slug} onChange={set('slug')} required />
                <FormField label="Nama Mempelai Wanita *" placeholder="Siti Ratna Sari" value={form.brideName} onChange={set('brideName')} required />
                <FormField label="Nama Singkat Wanita *" placeholder="Ratna" value={form.brideShort} onChange={set('brideShort')} required />
                <FormField label="Orang Tua Wanita *" placeholder="Bapak/Ibu ..." value={form.brideParents} onChange={set('brideParents')} required />
                <FormField label="Nama Mempelai Pria *" placeholder="Aditya Wijaya" value={form.groomName} onChange={set('groomName')} required />
                <FormField label="Nama Singkat Pria *" placeholder="Aditya" value={form.groomShort} onChange={set('groomShort')} required />
                <FormField label="Orang Tua Pria *" placeholder="Bapak/Ibu ..." value={form.groomParents} onChange={set('groomParents')} required />
                <FormField label="Tanggal Pernikahan *" type="datetime-local" value={form.date} onChange={set('date')} required />
                <FormField label="Waktu Akad *" placeholder="09.00 - 10.00 WIB" value={form.akadTime} onChange={set('akadTime')} required />
                <FormField label="Lokasi Akad *" placeholder="Masjid ..." value={form.akadLocation} onChange={set('akadLocation')} required />
                <FormField label="Alamat Akad" placeholder="Jl. ..." value={form.akadAddress} onChange={set('akadAddress')} />
                <FormField label="Waktu Resepsi *" placeholder="11.00 - 14.00 WIB" value={form.resepsiTime} onChange={set('resepsiTime')} required />
                <FormField label="Lokasi Resepsi *" placeholder="Gedung ..." value={form.resepsiLocation} onChange={set('resepsiLocation')} required />
                <FormField label="Alamat Resepsi" placeholder="Jl. ..." value={form.resepsiAddress} onChange={set('resepsiAddress')} />
                <div className="sm:col-span-2">
                    <TemplateSelector
                        value={form.themeId}
                        onChange={(val) => setForm({ ...form, themeId: val })}
                    />
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
