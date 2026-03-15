'use client';

import { useState, useEffect } from 'react';
import {
    Loader2, Check, Edit2, Camera, Plus, Trash2,
    CreditCard, Clock, Link as LinkIcon, AlertTriangle,
} from 'lucide-react';
import { useDashboard } from '../dashboard-context';
import { Section, FormGrid, FormField, SelectWeddingPrompt, TemplateSelector } from '../components';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TimelineItem { year: string; title: string; description: string; }
interface BankAccount { bank: string; number: string; holder: string; }

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimelineEditor({
    items, onChange,
}: { items: TimelineItem[]; onChange: (items: TimelineItem[]) => void }) {
    const add = () => onChange([...items, { year: '', title: '', description: '' }]);
    const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
    const update = (i: number, key: keyof TimelineItem, val: string) =>
        onChange(items.map((item, idx) => idx === i ? { ...item, [key]: val } : item));

    return (
        <div className="space-y-4">
            {items.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed text-center py-8"
                    style={{ borderColor: 'var(--ui-border)', color: 'var(--ui-text-muted)' }}>
                    <Clock className="w-6 h-6 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Belum ada cerita. Tambahkan perjalanan cinta Anda.</p>
                </div>
            )}

            {items.map((item, i) => (
                <div key={i} className="rounded-2xl border p-4 space-y-3 relative"
                    style={{ background: 'var(--ui-bg-hover)', borderColor: 'var(--ui-border)' }}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold rounded-full px-2 py-0.5"
                            style={{ background: 'rgba(201,169,110,0.15)', color: 'var(--color-gold, #c9a96e)' }}>
                            #{i + 1}
                        </span>
                        <button type="button" onClick={() => remove(i)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-lg hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" style={{ color: 'var(--ui-text-muted)' }}>Tahun</label>
                            <input
                                value={item.year}
                                onChange={e => update(i, 'year', e.target.value)}
                                placeholder="2023"
                                className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none focus:ring-1"
                                style={{ background: 'var(--ui-input-bg)', borderColor: 'var(--ui-input-border)', color: 'var(--ui-text-primary)' }}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" style={{ color: 'var(--ui-text-muted)' }}>Judul</label>
                            <input
                                value={item.title}
                                onChange={e => update(i, 'title', e.target.value)}
                                placeholder="First Meeting"
                                className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none focus:ring-1"
                                style={{ background: 'var(--ui-input-bg)', borderColor: 'var(--ui-input-border)', color: 'var(--ui-text-primary)' }}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium" style={{ color: 'var(--ui-text-muted)' }}>Deskripsi</label>
                        <textarea
                            value={item.description}
                            onChange={e => update(i, 'description', e.target.value)}
                            placeholder="Ceritakan momen spesial ini..."
                            rows={2}
                            className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none focus:ring-1 resize-none"
                            style={{ background: 'var(--ui-input-bg)', borderColor: 'var(--ui-input-border)', color: 'var(--ui-text-primary)' }}
                        />
                    </div>
                </div>
            ))}

            <button type="button" onClick={add}
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border-2 border-dashed w-full justify-center transition-all hover:bg-gold/5"
                style={{ borderColor: 'rgba(201,169,110,0.3)', color: 'var(--color-gold, #c9a96e)' }}>
                <Plus className="w-4 h-4" /> Tambah Momen
            </button>
        </div>
    );
}

function BankAccountEditor({
    accounts, onChange,
}: { accounts: BankAccount[]; onChange: (accounts: BankAccount[]) => void }) {
    const add = () => onChange([...accounts, { bank: '', number: '', holder: '' }]);
    const remove = (i: number) => onChange(accounts.filter((_, idx) => idx !== i));
    const update = (i: number, key: keyof BankAccount, val: string) =>
        onChange(accounts.map((acc, idx) => idx === i ? { ...acc, [key]: val } : acc));

    return (
        <div className="space-y-4">
            {accounts.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed text-center py-8"
                    style={{ borderColor: 'var(--ui-border)', color: 'var(--ui-text-muted)' }}>
                    <CreditCard className="w-6 h-6 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Belum ada rekening. Tambahkan rekening untuk amplop digital.</p>
                </div>
            )}

            {accounts.map((acc, i) => (
                <div key={i} className="rounded-2xl border p-4 space-y-3"
                    style={{ background: 'var(--ui-bg-hover)', borderColor: 'var(--ui-border)' }}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold rounded-full px-2 py-0.5"
                            style={{ background: 'rgba(201,169,110,0.15)', color: 'var(--color-gold, #c9a96e)' }}>
                            Rekening #{i + 1}
                        </span>
                        <button type="button" onClick={() => remove(i)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-lg hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {([
                            { key: 'bank', label: 'Bank', placeholder: 'BCA' },
                            { key: 'number', label: 'Nomor Rekening', placeholder: '1234567890' },
                            { key: 'holder', label: 'Atas Nama', placeholder: 'Nama Pemilik' },
                        ] as { key: keyof BankAccount; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
                            <div key={key} className="space-y-1">
                                <label className="text-xs font-medium" style={{ color: 'var(--ui-text-muted)' }}>{label}</label>
                                <input
                                    value={acc[key]}
                                    onChange={e => update(i, key, e.target.value)}
                                    placeholder={placeholder}
                                    className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none focus:ring-1"
                                    style={{ background: 'var(--ui-input-bg)', borderColor: 'var(--ui-input-border)', color: 'var(--ui-text-primary)' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <button type="button" onClick={add}
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border-2 border-dashed w-full justify-center transition-all hover:bg-gold/5"
                style={{ borderColor: 'rgba(201,169,110,0.3)', color: 'var(--color-gold, #c9a96e)' }}>
                <Plus className="w-4 h-4" /> Tambah Rekening
            </button>
        </div>
    );
}

// ─── Slug utility (sama seperti di weddings/page.tsx) ────────────────────────
function generateSlug(bride: string, groom: string): string {
    const toSlug = (s: string) =>
        s.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EditPage() {
    const { selectedWedding: wedding, fetchWeddings, loading: ctxLoading } = useDashboard();
    const [form, setForm] = useState<any>(null);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [slugSynced, setSlugSynced] = useState(true); // true = slug ikut nama mempelai
    const [originalSlug, setOriginalSlug] = useState('');  // slug asli dari DB
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (wedding) {
            const raw = wedding as any;
            const slug = raw.slug || '';
            setOriginalSlug(slug);
            setForm({
                slug,
                brideName: wedding.brideName,
                brideShort: wedding.brideShort,
                brideParents: raw.brideParents || '',
                groomName: wedding.groomName,
                groomShort: wedding.groomShort,
                groomParents: raw.groomParents || '',
                date: wedding.date ? new Date(wedding.date).toISOString().slice(0, 16) : '',
                akadTime: raw.akadTime || '',
                akadLocation: wedding.akadLocation,
                akadAddress: raw.akadAddress || '',
                akadMapUrl: raw.akadMapUrl || '',
                resepsiTime: raw.resepsiTime || '',
                resepsiLocation: wedding.resepsiLocation,
                resepsiAddress: raw.resepsiAddress || '',
                resepsiMapUrl: raw.resepsiMapUrl || '',
                themeId: wedding.themeId || 'javanese',
                isPublished: wedding.isPublished,
            });
            setTimeline(
                Array.isArray(raw.timeline)
                    ? raw.timeline.map((t: any) => ({ year: t.year, title: t.title, description: t.description }))
                    : []
            );
            setBankAccounts(
                Array.isArray(raw.bankAccounts)
                    ? raw.bankAccounts.map((b: any) => ({ bank: b.bank, number: b.number, holder: b.holder }))
                    : []
            );
        }
    }, [wedding]);

    if (ctxLoading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
    if (!wedding) return <SelectWeddingPrompt />;
    if (!form) return null;

    const set = (k: string) => (e: any) => {
        const val = e.target.value;
        setForm((f: any) => {
            const next = { ...f, [k]: val };
            // Auto-update slug ketika nama singkat berubah
            if (slugSynced && (k === 'brideShort' || k === 'groomShort')) {
                next.slug = generateSlug(
                    k === 'brideShort' ? val : f.brideShort,
                    k === 'groomShort' ? val : f.groomShort,
                );
            }
            return next;
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/weddings/${wedding.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                // Include timeline & bankAccounts for full CRUD
                body: JSON.stringify({ ...form, timeline, bankAccounts }),
            });
            if (!res.ok) { const d = await res.json(); setError(d.error); return; }
            setSaved(true);
            fetchWeddings();
            setTimeout(() => setSaved(false), 3000);
        } catch { setError('Gagal menyimpan.'); }
        finally { setLoading(false); }
    };

    // Photo preview helper
    const wPhotos = (wedding as any).photos as Record<string, string> ?? {};

    return (
        <form onSubmit={handleSave} className="space-y-8">
            {error && (
                <p className="text-red-500 text-sm p-3 rounded-xl border"
                    style={{ background: 'color-mix(in srgb, #EF4444 8%, transparent)', borderColor: 'color-mix(in srgb, #EF4444 20%, transparent)' }}>
                    {error}
                </p>
            )}

            {/* ── URL Undangan ── */}
            <Section title="URL Undangan">
                <div className="space-y-2">
                    {/* Sync toggle */}
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs" style={{ color: 'var(--ui-text-muted)' }}>
                            {slugSynced
                                ? '🔗 URL mengikuti nama singkat mempelai secara otomatis'
                                : '✏️ URL diatur manual'}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSlugSynced(s => {
                                    // Saat aktifkan sync: langsung update slug ke nilai dari nama saat ini
                                    if (!s && form) {
                                        const newSlug = generateSlug(form.brideShort, form.groomShort);
                                        if (newSlug) setForm((f: any) => ({ ...f, slug: newSlug }));
                                    }
                                    return !s;
                                });
                            }}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all"
                            style={{
                                color: slugSynced ? 'var(--color-gold, #c9a96e)' : 'var(--ui-text-muted)',
                                borderColor: slugSynced ? 'rgba(201,169,110,0.4)' : 'var(--ui-border)',
                                background: slugSynced ? 'rgba(201,169,110,0.08)' : 'transparent',
                            }}>
                            {slugSynced ? '🔗 Auto' : '🔓 Manual'}
                        </button>
                    </div>

                    {/* URL input */}
                    <div className="flex items-center gap-0 rounded-xl overflow-hidden border"
                        style={{
                            borderColor: form?.slug !== originalSlug ? 'rgba(251,191,36,0.5)' : 'var(--ui-input-border)',
                            background: 'var(--ui-input-bg)',
                        }}>
                        <span className="px-3 py-2.5 text-sm border-r shrink-0"
                            style={{ color: 'var(--ui-text-muted)', borderColor: 'var(--ui-input-border)', background: 'var(--ui-bg-hover)' }}>
                            vowify.id/
                        </span>
                        <input
                            value={form?.slug || ''}
                            readOnly={slugSynced}
                            onChange={e => setForm((f: any) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                            placeholder="nama-mempelai-tahun"
                            className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none"
                            style={{
                                color: 'var(--ui-text-primary)',
                                cursor: slugSynced ? 'default' : 'text',
                            }}
                        />
                        <a
                            href={form?.slug ? `/${form.slug}` : '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2.5 text-sm border-l flex items-center gap-1 transition-all hover:bg-gold/10 shrink-0"
                            style={{ color: 'var(--color-gold, #c9a96e)', borderColor: 'var(--ui-input-border)' }}>
                            <LinkIcon className="w-3.5 h-3.5" />
                            Buka
                        </a>
                    </div>

                    {/* Changed indicator */}
                    {form?.slug !== originalSlug && (
                        <div className="flex items-start gap-2 text-[11px] rounded-xl p-2.5"
                            style={{ background: 'rgba(251,191,36,0.07)', color: 'rgba(251,191,36,0.85)' }}>
                            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <span>
                                URL berubah dari <code className="font-mono bg-black/10 px-1 rounded">{originalSlug}</code> →{' '}
                                <code className="font-mono bg-black/10 px-1 rounded">{form.slug}</code>.{' '}
                                Link lama tidak akan berfungsi setelah disimpan.
                            </span>
                        </div>
                    )}
                </div>
            </Section>

            {/* ── Mempelai Wanita ── */}
            <Section title="Mempelai Wanita">
                <FormGrid>
                    <FormField label="Nama Lengkap" value={form.brideName} onChange={set('brideName')} />
                    <FormField label="Nama Singkat" value={form.brideShort} onChange={set('brideShort')} />
                    <FormField label="Orang Tua" value={form.brideParents} onChange={set('brideParents')} />
                </FormGrid>
                <PhotoPreviewHint url={wPhotos['bride_portrait'] || (wedding as any).brideImage} label="mempelai wanita" />
            </Section>

            {/* ── Mempelai Pria ── */}
            <Section title="Mempelai Pria">
                <FormGrid>
                    <FormField label="Nama Lengkap" value={form.groomName} onChange={set('groomName')} />
                    <FormField label="Nama Singkat" value={form.groomShort} onChange={set('groomShort')} />
                    <FormField label="Orang Tua" value={form.groomParents} onChange={set('groomParents')} />
                </FormGrid>
                <PhotoPreviewHint url={wPhotos['groom_portrait'] || (wedding as any).groomImage} label="mempelai pria" />
            </Section>

            {/* ── Tanggal & Akad ── */}
            <Section title="Tanggal & Akad">
                <FormGrid>
                    <FormField label="Tanggal Pernikahan" type="datetime-local" value={form.date} onChange={set('date')} />
                    <FormField label="Waktu Akad" value={form.akadTime} onChange={set('akadTime')} placeholder="09.00 - 10.00 WIB" />
                    <FormField label="Lokasi Akad" value={form.akadLocation} onChange={set('akadLocation')} />
                    <FormField label="Alamat Akad" value={form.akadAddress} onChange={set('akadAddress')} />
                    <FormField label="Google Maps URL Akad" value={form.akadMapUrl} onChange={set('akadMapUrl')} placeholder="https://maps.app.goo.gl/..." />
                </FormGrid>
            </Section>

            {/* ── Resepsi ── */}
            <Section title="Resepsi">
                <FormGrid>
                    <FormField label="Waktu Resepsi" value={form.resepsiTime} onChange={set('resepsiTime')} placeholder="11.00 - 14.00 WIB" />
                    <FormField label="Lokasi Resepsi" value={form.resepsiLocation} onChange={set('resepsiLocation')} />
                    <FormField label="Alamat Resepsi" value={form.resepsiAddress} onChange={set('resepsiAddress')} />
                    <FormField label="Google Maps URL Resepsi" value={form.resepsiMapUrl} onChange={set('resepsiMapUrl')} placeholder="https://maps.app.goo.gl/..." />
                </FormGrid>
            </Section>

            {/* ── Kisah Cinta (Timeline) ── */}
            <Section title="Kisah Cinta">
                <p className="text-xs mb-4" style={{ color: 'var(--ui-text-muted)' }}>
                    Ceritakan perjalanan cinta Anda — akan tampil di bagian Timeline undangan.
                </p>
                <TimelineEditor items={timeline} onChange={setTimeline} />
            </Section>

            {/* ── Amplop Digital (Bank Accounts) ── */}
            <Section title="Amplop Digital">
                <p className="text-xs mb-4" style={{ color: 'var(--ui-text-muted)' }}>
                    Tambahkan rekening bank untuk hadiah digital. Untuk QRIS, upload di halaman{' '}
                    <Link href="/dashboard/gallery" className="font-semibold hover:underline" style={{ color: 'var(--color-gold, #c9a96e)' }}>
                        Foto & Media
                    </Link>.
                </p>
                <BankAccountEditor accounts={bankAccounts} onChange={setBankAccounts} />
            </Section>

            {/* ── Template ── */}
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

            {/* ── Save ── */}
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

// ─── Photo preview hint ───────────────────────────────────────────────────────
function PhotoPreviewHint({ url, label }: { url?: string; label: string }) {
    return (
        <div className="flex items-center gap-3 mt-1">
            <div className="w-12 h-16 rounded-xl overflow-hidden border flex-shrink-0"
                style={{ borderColor: 'var(--ui-border)', background: 'var(--ui-bg-hover)' }}>
                {url
                    ? <img src={url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Camera className="w-4 h-4 opacity-30" style={{ color: 'var(--ui-text-muted)' }} /></div>
                }
            </div>
            <div>
                <p className="text-xs" style={{ color: 'var(--ui-text-muted)' }}>
                    {url ? `Foto ${label} sudah diatur.` : `Foto ${label} belum diatur.`}
                </p>
                <Link href="/dashboard/gallery" className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-gold, #c9a96e)' }}>
                    Kelola Foto & Media →
                </Link>
            </div>
        </div>
    );
}
