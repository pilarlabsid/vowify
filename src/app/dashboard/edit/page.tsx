'use client';

import { useState, useEffect } from 'react';
import { Loader2, Check, Edit2, Camera } from 'lucide-react';
import { useDashboard } from '../dashboard-context';
import { Section, FormGrid, FormField, SelectWeddingPrompt, TemplateSelector } from '../components';
import Link from 'next/link';

export default function EditPage() {
    const { selectedWedding: wedding, fetchWeddings, loading: ctxLoading } = useDashboard();
    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (wedding) {
            setForm({
                brideName: wedding.brideName,
                brideShort: wedding.brideShort,
                brideParents: (wedding as any).brideParents || '',
                groomName: wedding.groomName,
                groomShort: wedding.groomShort,
                groomParents: (wedding as any).groomParents || '',
                date: wedding.date ? new Date(wedding.date).toISOString().slice(0, 16) : '',
                akadTime: (wedding as any).akadTime || '',
                akadLocation: wedding.akadLocation,
                akadAddress: (wedding as any).akadAddress || '',
                akadMapUrl: (wedding as any).akadMapUrl || '',
                resepsiTime: (wedding as any).resepsiTime || '',
                resepsiLocation: wedding.resepsiLocation,
                resepsiAddress: (wedding as any).resepsiAddress || '',
                resepsiMapUrl: (wedding as any).resepsiMapUrl || '',
                themeId: wedding.themeId || 'javanese',
                isPublished: wedding.isPublished,
            });
        }
    }, [wedding]);

    if (ctxLoading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
    if (!wedding) return <SelectWeddingPrompt />;
    if (!form) return null;

    const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }));

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/weddings/${wedding.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) { const d = await res.json(); setError(d.error); return; }
            setSaved(true);
            fetchWeddings();
            setTimeout(() => setSaved(false), 3000);
        } catch { setError('Gagal menyimpan.'); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={handleSave} className="space-y-8">
            {error && (
                <p className="text-red-500 text-sm p-3 rounded-xl border"
                    style={{ background: 'color-mix(in srgb, #EF4444 8%, transparent)', borderColor: 'color-mix(in srgb, #EF4444 20%, transparent)' }}>
                    {error}
                </p>
            )}

            <Section title="Mempelai Wanita">
                <FormGrid>
                    <FormField label="Nama Lengkap" value={form.brideName} onChange={set('brideName')} />
                    <FormField label="Nama Singkat" value={form.brideShort} onChange={set('brideShort')} />
                    <FormField label="Orang Tua" value={form.brideParents} onChange={set('brideParents')} />
                </FormGrid>
                {/* Photo preview — reads from new photos map, fallback to legacy field */}
                <div className="flex items-center gap-3 mt-1">
                    {(() => {
                        const wPhotos = (wedding as any).photos as Record<string, string> ?? {};
                        const img = wPhotos['bride_portrait'] || (wedding as any).brideImage || '';
                        return (
                            <div className="w-12 h-16 rounded-xl overflow-hidden border flex-shrink-0"
                                style={{ borderColor: 'var(--ui-border)', background: 'var(--ui-bg-hover)' }}>
                                {img
                                    ? <img src={img} alt="" className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center"><Camera className="w-4 h-4 opacity-30" style={{ color: 'var(--ui-text-muted)' }} /></div>
                                }
                            </div>
                        );
                    })()}
                    <div>
                        <p className="text-xs" style={{ color: 'var(--ui-text-muted)' }}>
                            {((wedding as any).photos as Record<string, string>)?.['bride_portrait'] || (wedding as any).brideImage
                                ? 'Foto mempelai wanita sudah diatur.' : 'Foto mempelai wanita belum diatur.'}
                        </p>
                        <Link href="/dashboard/gallery" className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-gold, #c9a96e)' }}>
                            Kelola Foto & Media →
                        </Link>
                    </div>
                </div>
            </Section>

            <Section title="Mempelai Pria">
                <FormGrid>
                    <FormField label="Nama Lengkap" value={form.groomName} onChange={set('groomName')} />
                    <FormField label="Nama Singkat" value={form.groomShort} onChange={set('groomShort')} />
                    <FormField label="Orang Tua" value={form.groomParents} onChange={set('groomParents')} />
                </FormGrid>
                {/* Photo preview — reads from new photos map, fallback to legacy field */}
                <div className="flex items-center gap-3 mt-1">
                    {(() => {
                        const wPhotos = (wedding as any).photos as Record<string, string> ?? {};
                        const img = wPhotos['groom_portrait'] || (wedding as any).groomImage || '';
                        return (
                            <div className="w-12 h-16 rounded-xl overflow-hidden border flex-shrink-0"
                                style={{ borderColor: 'var(--ui-border)', background: 'var(--ui-bg-hover)' }}>
                                {img
                                    ? <img src={img} alt="" className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center"><Camera className="w-4 h-4 opacity-30" style={{ color: 'var(--ui-text-muted)' }} /></div>
                                }
                            </div>
                        );
                    })()}
                    <div>
                        <p className="text-xs" style={{ color: 'var(--ui-text-muted)' }}>
                            {((wedding as any).photos as Record<string, string>)?.['groom_portrait'] || (wedding as any).groomImage
                                ? 'Foto mempelai pria sudah diatur.' : 'Foto mempelai pria belum diatur.'}
                        </p>
                        <Link href="/dashboard/gallery" className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-gold, #c9a96e)' }}>
                            Kelola Foto & Media →
                        </Link>
                    </div>
                </div>
            </Section>

            <Section title="Tanggal & Akad">
                <FormGrid>
                    <FormField label="Tanggal Pernikahan" type="datetime-local" value={form.date} onChange={set('date')} />
                    <FormField label="Waktu Akad" value={form.akadTime} onChange={set('akadTime')} />
                    <FormField label="Lokasi Akad" value={form.akadLocation} onChange={set('akadLocation')} />
                    <FormField label="Alamat Akad" value={form.akadAddress} onChange={set('akadAddress')} />
                    <FormField label="Google Maps URL Akad" value={form.akadMapUrl} onChange={set('akadMapUrl')} />
                </FormGrid>
            </Section>

            <Section title="Resepsi">
                <FormGrid>
                    <FormField label="Waktu Resepsi" value={form.resepsiTime} onChange={set('resepsiTime')} />
                    <FormField label="Lokasi Resepsi" value={form.resepsiLocation} onChange={set('resepsiLocation')} />
                    <FormField label="Alamat Resepsi" value={form.resepsiAddress} onChange={set('resepsiAddress')} />
                    <FormField label="Google Maps URL Resepsi" value={form.resepsiMapUrl} onChange={set('resepsiMapUrl')} />
                </FormGrid>
            </Section>

            <Section title="Pengaturan Template">
                <FormGrid>
                    <div className="w-full">
                        <TemplateSelector
                            value={form.themeId}
                            onChange={(val) => setForm((f: any) => ({ ...f, themeId: val }))}
                        />
                    </div>
                </FormGrid>
            </Section>

            <div className="flex items-center gap-4 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-elegant text-gold px-8 py-3 rounded-full font-bold hover:bg-gold hover:text-primary transition-all disabled:opacity-60 border border-gold/30"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Edit2 className="w-4 h-4" />}
                    {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
                </button>
            </div>
        </form>
    );
}
