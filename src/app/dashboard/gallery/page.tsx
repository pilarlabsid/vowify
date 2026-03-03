'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, X, Check } from 'lucide-react';
import { useDashboard } from '../dashboard-context';
import { SelectWeddingPrompt } from '../components';

export default function GalleryPage() {
    const { selectedWedding: wedding, fetchWeddings, loading: ctxLoading } = useDashboard();
    const [urls, setUrls] = useState<string[]>([]);
    const [newUrl, setNewUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (wedding) setUrls((wedding as any).gallery || []);
    }, [wedding]);

    if (ctxLoading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
    if (!wedding) return <SelectWeddingPrompt />;

    const addUrl = () => {
        if (!newUrl.trim()) return;
        setUrls([...urls, newUrl.trim()]);
        setNewUrl('');
    };

    const removeUrl = (i: number) => setUrls(urls.filter((_, idx) => idx !== i));

    const handleSave = async () => {
        setSaving(true);
        await fetch(`/api/weddings/${wedding.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gallery: urls }),
        });
        setSaving(false);
        setSaved(true);
        fetchWeddings();
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-neutral-800">Tambah URL Foto</h3>
                <div className="flex gap-3">
                    <input
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://... atau /images/..."
                        className="flex-1 border border-neutral-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
                    />
                    <button type="button" onClick={addUrl} className="flex items-center gap-2 bg-gold/10 text-primary border border-gold/30 px-5 py-3 rounded-2xl font-bold hover:bg-gold hover:text-primary transition-all text-sm">
                        <Plus className="w-4 h-4" /> Tambah
                    </button>
                </div>

                {urls.length === 0 ? (
                    <p className="text-neutral-400 text-sm text-center py-8">Belum ada foto. Tambahkan URL foto di atas.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {urls.map((url, i) => (
                            <div key={i} className="relative group aspect-square bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200">
                                <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/gallery_1.png'; }} />
                                <button
                                    onClick={() => removeUrl(i)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-elegant text-gold border border-gold/30 px-6 py-3 rounded-full font-bold hover:bg-gold hover:text-primary transition-all text-sm disabled:opacity-60"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4 text-emerald-400" /> : null}
                    {saved ? 'Tersimpan!' : 'Simpan Galeri'}
                </button>
            </div>
        </div>
    );
}
