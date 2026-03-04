'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Loader2, Plus, X, Check, Upload, Link as LinkIcon,
    ImageIcon, Camera, Image as GalleryIcon,
    Layers, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useDashboard } from '../dashboard-context';
import { SelectWeddingPrompt } from '../components';
import {
    getPhotoSlotsBySection, getOtherTemplatePhotos,
    PhotoSlot, TEMPLATES,
} from '@/templates/registry';

const MAX_GALLERY_PHOTOS = 30;

// ─── Tooltip helper ──────────────────────────────────────────────────────────
function Badge({ children, color = 'gold' }: { children: React.ReactNode; color?: 'gold' | 'blue' | 'green' }) {
    const styles: Record<string, React.CSSProperties> = {
        gold: { background: 'rgba(201,169,110,0.15)', color: 'var(--color-gold, #c9a96e)' },
        blue: { background: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
        green: { background: 'rgba(16,185,129,0.12)', color: '#34d399' },
    };
    return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={styles[color]}>
            {children}
        </span>
    );
}

// ─── Single slot uploader ────────────────────────────────────────────────────
interface SlotUploaderProps {
    slot: PhotoSlot;
    currentUrl: string;
    onUploaded: (url: string) => void;
}

function SlotUploader({ slot, currentUrl, onUploaded }: SlotUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [urlMode, setUrlMode] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const upload = useCallback(async (file: File) => {
        setError('');
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal upload');
            onUploaded(data.url);
        } catch (e: any) {
            setError((e as Error).message);
        } finally {
            setUploading(false);
        }
    }, [onUploaded]);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = Array.from(e.dataTransfer.files).find(f => f.type.startsWith('image/'));
        if (file) await upload(file);
    }, [upload]);

    const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await upload(file);
        if (inputRef.current) inputRef.current.value = '';
    }, [upload]);

    const applyUrl = () => {
        if (urlInput.trim()) { onUploaded(urlInput.trim()); setUrlInput(''); setUrlMode(false); }
    };

    const aspectStyle = { aspectRatio: slot.aspect.replace('/', ' / ') };

    return (
        <div className="rounded-2xl border p-4 space-y-3 transition-all"
            style={{ borderColor: 'var(--ui-border)', background: 'var(--ui-bg-hover)' }}>

            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center flex-wrap gap-1.5">
                        <span className="text-sm font-bold" style={{ color: 'var(--ui-text-primary)' }}>
                            {slot.label}
                        </span>
                        {slot.required && <Badge color="gold">Wajib</Badge>}
                        {slot.canonical && <Badge color="blue">✦ Universal</Badge>}
                    </div>
                    {slot.hint && (
                        <p className="text-[11px]" style={{ color: 'var(--ui-text-muted)' }}>
                            {slot.hint}
                        </p>
                    )}
                </div>
                <button type="button" onClick={() => setUrlMode(!urlMode)}
                    className="shrink-0 flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border transition-all"
                    style={{ color: 'var(--ui-text-muted)', borderColor: 'var(--ui-border)' }}>
                    <LinkIcon className="w-3 h-3" />
                    {urlMode ? 'Upload' : 'URL'}
                </button>
            </div>

            {/* URL input mode */}
            {urlMode ? (
                <div className="flex gap-2">
                    <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyUrl())}
                        placeholder="https://..."
                        className="flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none border"
                        style={{ background: 'var(--ui-input-bg)', borderColor: 'var(--ui-input-border)', color: 'var(--ui-text-primary)' }}
                    />
                    <button type="button" onClick={applyUrl}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-gold/10 border border-gold/30 hover:bg-gold hover:text-primary transition-all"
                        style={{ color: 'var(--ui-text-primary)' }}>
                        OK
                    </button>
                </div>
            ) : (
                <div className="flex gap-3 items-start">
                    {/* Preview — aspect ratio matches slot spec */}
                    <div className="shrink-0 w-20 rounded-xl overflow-hidden border"
                        style={{ ...aspectStyle, borderColor: 'var(--ui-border)', background: 'var(--ui-bg-card)' }}>
                        {currentUrl ? (
                            <img src={currentUrl} alt={slot.label} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                <Camera className="w-5 h-5 opacity-20" style={{ color: 'var(--ui-text-muted)' }} />
                                <span className="text-[9px]" style={{ color: 'var(--ui-text-muted)' }}>Kosong</span>
                            </div>
                        )}
                    </div>

                    {/* Dropzone */}
                    <div onDrop={handleDrop}
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => inputRef.current?.click()}
                        className="flex-1 flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-all"
                        style={{
                            borderColor: isDragging ? 'var(--color-gold, #c9a96e)' : 'var(--ui-input-border)',
                            background: isDragging ? 'rgba(201,169,110,0.07)' : 'var(--ui-input-bg)',
                        }}>
                        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-gold, #c9a96e)' }} />
                                <p className="text-xs" style={{ color: 'var(--ui-text-muted)' }}>Mengupload...</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" style={{ color: 'var(--color-gold, #c9a96e)' }} />
                                <p className="text-xs font-semibold text-center" style={{ color: 'var(--ui-text-primary)' }}>
                                    {currentUrl ? 'Ganti Foto' : 'Upload Foto'}
                                </p>
                                <p className="text-[10px] text-center" style={{ color: 'var(--ui-text-muted)' }}>
                                    Drag & drop atau klik · Maks. 5MB
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                    <X className="w-3 h-3" /> {error}
                </p>
            )}
        </div>
    );
}

// ─── Other-template photos section ──────────────────────────────────────────
function OtherTemplatePhotosSection({
    photos, currentThemeId,
}: { photos: Record<string, string>; currentThemeId: string }) {
    const [open, setOpen] = useState(false);
    const others = getOtherTemplatePhotos(photos, currentThemeId);
    if (others.length === 0) return null;

    return (
        <div className="rounded-3xl border overflow-hidden"
            style={{ borderColor: 'var(--ui-border)', background: 'var(--ui-bg-card)' }}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-4 text-left transition-all hover:bg-gold/5"
            >
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" style={{ color: 'var(--color-gold, #c9a96e)' }} />
                    <span className="font-semibold text-sm" style={{ color: 'var(--ui-text-primary)' }}>
                        Foto tersimpan dari template lain
                    </span>
                    <Badge color="blue">{others.length} foto</Badge>
                </div>
                {open
                    ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--ui-text-muted)' }} />
                    : <ChevronDown className="w-4 h-4" style={{ color: 'var(--ui-text-muted)' }} />
                }
            </button>

            {open && (
                <div className="px-6 pb-6 space-y-4 border-t" style={{ borderColor: 'var(--ui-border)' }}>
                    <p className="text-xs pt-4" style={{ color: 'var(--ui-text-muted)' }}>
                        Foto dari template lain — tersimpan dan aktif kembali saat template itu dipilih.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {others.map(({ key, url, fromTemplates }) => (
                            <div key={key} className="space-y-1.5">
                                <div className="relative aspect-square rounded-xl overflow-hidden border"
                                    style={{ borderColor: 'var(--ui-border)', background: 'var(--ui-bg-hover)' }}>
                                    <img src={url} alt={key} className="w-full h-full object-cover" />
                                    {fromTemplates.length > 0 && (
                                        <div className="absolute inset-x-0 bottom-0 px-2 py-1.5 bg-gradient-to-t from-black/70 to-transparent">
                                            <p className="text-[10px] text-white font-medium truncate">
                                                Template: {fromTemplates.join(', ')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] font-mono truncate" style={{ color: 'var(--ui-text-muted)' }}>
                                    {key}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
type Tab = 'template_photos' | 'gallery';

export default function PhotosPage() {
    const { selectedWedding: wedding, fetchWeddings, loading: ctxLoading } = useDashboard();

    // Template photos state
    const [photos, setPhotos] = useState<Record<string, string>>({});
    const [savingPhotos, setSavingPhotos] = useState(false);
    const [savedPhotos, setSavedPhotos] = useState(false);

    // Gallery state
    const [urls, setUrls] = useState<string[]>([]);
    const [newUrl, setNewUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // UI
    const [activeTab, setActiveTab] = useState<Tab>('template_photos');
    const [storageInfo, setStorageInfo] = useState<{ used: string, quota: string, percentUsed: number, remaining: string } | null>(null);

    const fetchStorage = useCallback(async () => {
        try {
            const res = await fetch('/api/storage/info');
            if (res.ok) setStorageInfo(await res.json());
        } catch { }
    }, []);

    useEffect(() => {
        fetchStorage();
    }, [fetchStorage]);

    // Sync from wedding data
    useEffect(() => {
        if (wedding) {
            const raw = (wedding as any).photos;
            const parsed: Record<string, string> = typeof raw === 'string'
                ? JSON.parse(raw || '{}')
                : (raw ?? {});

            // Backward compat: migrate legacy brideImage/groomImage into photos map
            const migrated = { ...parsed };
            if (!migrated['bride_portrait'] && (wedding as any).brideImage) {
                migrated['bride_portrait'] = (wedding as any).brideImage;
            }
            if (!migrated['groom_portrait'] && (wedding as any).groomImage) {
                migrated['groom_portrait'] = (wedding as any).groomImage;
            }
            setPhotos(migrated);
            setUrls((wedding as any).gallery || []);
        }
    }, [wedding]);

    // Gallery upload helpers
    const uploadGalleryFile = useCallback(async (file: File) => {
        if (urls.length >= MAX_GALLERY_PHOTOS) {
            setUploadError(`Maksimal ${MAX_GALLERY_PHOTOS} foto galeri.`);
            return;
        }
        setUploadError('');
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal upload');
            setUrls(prev => {
                if (prev.length >= MAX_GALLERY_PHOTOS) return prev;
                return [...prev, data.url];
            });
        } catch (e: any) {
            setUploadError((e as Error).message);
        } finally {
            setUploading(false);
        }
    }, []);

    const handleGalleryDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (urls.length >= MAX_GALLERY_PHOTOS) return;
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        const allowedFiles = files.slice(0, MAX_GALLERY_PHOTOS - urls.length);
        for (const file of allowedFiles) await uploadGalleryFile(file);
    }, [uploadGalleryFile, urls.length]);

    const handleGalleryFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (urls.length >= MAX_GALLERY_PHOTOS) return;
        const files = Array.from(e.target.files || []);
        const allowedFiles = files.slice(0, MAX_GALLERY_PHOTOS - urls.length);
        for (const file of allowedFiles) await uploadGalleryFile(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [uploadGalleryFile, urls.length]);

    const handleGalleryDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(true);
    }, []);
    const handleGalleryDragLeave = useCallback(() => setIsDragging(false), []);

    // ─ Early returns AFTER all hooks
    if (ctxLoading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
    if (!wedding) return <SelectWeddingPrompt />;

    const themeId = (wedding as any).themeId || 'javanese';
    const slotsBySection = getPhotoSlotsBySection(themeId);
    const allSlots = Object.values(slotsBySection).flat();
    const filledSlots = allSlots.filter(s => !!photos[s.key]).length;

    const currentTemplate = TEMPLATES.find(t => t.id === themeId);

    const savePhotos = async () => {
        setSavingPhotos(true);
        await fetch(`/api/weddings/${wedding.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photos }),
        });
        setSavingPhotos(false);
        setSavedPhotos(true);
        fetchWeddings();
        fetchStorage();
        setTimeout(() => setSavedPhotos(false), 3000);
    };

    const addUrl = () => {
        if (!newUrl.trim() || urls.length >= MAX_GALLERY_PHOTOS) return;
        setUrls(prev => [...prev, newUrl.trim()]);
        setNewUrl('');
    };
    const removeUrl = (i: number) => setUrls(prev => prev.filter((_, idx) => idx !== i));
    const saveGallery = async () => {
        setSaving(true);
        await fetch(`/api/weddings/${wedding.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gallery: urls }),
        });
        setSaving(false);
        setSaved(true);
        fetchWeddings();
        fetchStorage();
        setTimeout(() => setSaved(false), 3000);
    };

    const tabs: { key: Tab; label: string; icon: React.ReactNode; badge?: string }[] = [
        {
            key: 'template_photos',
            label: 'Foto Template',
            icon: <Camera className="w-4 h-4" />,
            badge: allSlots.length > 0 ? `${filledSlots}/${allSlots.length}` : undefined,
        },
        {
            key: 'gallery',
            label: 'Galeri Foto',
            icon: <GalleryIcon className="w-4 h-4" />,
            badge: urls.length > 0 ? String(urls.length) : undefined,
        },
    ];

    return (
        <div className="space-y-6">

            {/* Storage Quota Indicator */}
            {storageInfo && (
                <div className="rounded-2xl p-4 border" style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 opacity-50" style={{ color: 'var(--ui-text-primary)' }} />
                            <span className="text-xs font-bold" style={{ color: 'var(--ui-text-primary)' }}>Penyimpanan Anda</span>
                        </div>
                        <span className="text-[11px] font-medium" style={{ color: 'var(--ui-text-muted)' }}>
                            {storageInfo.used} / {storageInfo.quota}
                        </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--ui-bg-hover)' }}>
                        <div className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${storageInfo.percentUsed}%`,
                                background: storageInfo.percentUsed > 90 ? '#ef4444' : 'var(--color-gold, #c9a96e)'
                            }}
                        />
                    </div>
                    {storageInfo.percentUsed > 90 && (
                        <p className="text-[10px] text-red-400 mt-2">
                            Penyimpanan hampir penuh. Harap hapus foto yang tidak terpakai atau ganti dengan link URL.
                        </p>
                    )}
                </div>
            )}

            {/* Tab Switcher */}
            <div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'var(--ui-bg-hover)' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all"
                        style={activeTab === t.key
                            ? { background: 'var(--ui-bg-card)', color: 'var(--ui-text-primary)', boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }
                            : { color: 'var(--ui-text-muted)' }
                        }>
                        {t.icon}
                        {t.label}
                        {t.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                style={activeTab === t.key
                                    ? { background: 'rgba(201,169,110,0.20)', color: 'var(--color-gold, #c9a96e)' }
                                    : { background: 'var(--ui-badge-bg)', color: 'var(--ui-text-muted)' }}>
                                {t.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ══ TAB: FOTO TEMPLATE ══ */}
            {activeTab === 'template_photos' && (
                <div className="space-y-5">

                    {/* Active template badge */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full border"
                            style={{ background: 'rgba(201,169,110,0.08)', borderColor: 'rgba(201,169,110,0.2)', color: 'var(--color-gold, #c9a96e)' }}>
                            Template aktif: <span className="capitalize">{currentTemplate?.name ?? themeId}</span>
                        </span>
                    </div>

                    {/* ── Slot sections (dynamic per active template) ── */}
                    {allSlots.length === 0 ? (
                        <div className="rounded-3xl p-12 text-center border-2 border-dashed"
                            style={{ borderColor: 'var(--ui-border)', background: 'var(--ui-bg-hover)' }}>
                            <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: 'var(--ui-text-muted)' }} />
                            <p className="text-sm font-medium" style={{ color: 'var(--ui-text-secondary)' }}>
                                Template ini belum mendefinisikan foto slot.
                            </p>
                        </div>
                    ) : (
                        <>
                            {Object.entries(slotsBySection).map(([sectionName, slots]) => (
                                <div key={sectionName} className="rounded-3xl p-6 border shadow-sm space-y-4"
                                    style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-base" style={{ color: 'var(--ui-text-primary)' }}>
                                            {sectionName}
                                        </h3>
                                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                            style={{ background: 'var(--ui-badge-bg)', color: 'var(--ui-text-muted)' }}>
                                            {slots.filter(s => !!photos[s.key]).length}/{slots.length} terisi
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {slots.map(slot => (
                                            <SlotUploader
                                                key={slot.key}
                                                slot={slot}
                                                currentUrl={photos[slot.key] ?? ''}
                                                onUploaded={url => setPhotos(prev => ({ ...prev, [slot.key]: url }))}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <button onClick={savePhotos} disabled={savingPhotos}
                                className="flex items-center gap-2 bg-elegant text-gold border border-gold/30 px-6 py-3 rounded-full font-bold hover:bg-gold hover:text-primary transition-all text-sm disabled:opacity-60">
                                {savingPhotos
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : savedPhotos
                                        ? <Check className="w-4 h-4 text-emerald-400" />
                                        : <Upload className="w-4 h-4" />
                                }
                                {savedPhotos ? 'Tersimpan!' : 'Simpan Foto'}
                            </button>
                        </>
                    )}

                    {/* ── Photos from other templates (collapsible) ── */}
                    <OtherTemplatePhotosSection photos={photos} currentThemeId={themeId} />
                </div>
            )}

            {/* ══ TAB: GALERI ══ */}
            {activeTab === 'gallery' && (
                <div className="space-y-6">
                    <div className="rounded-3xl p-6 border shadow-sm space-y-5"
                        style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-base" style={{ color: 'var(--ui-text-primary)' }}>
                                    Tambah Foto Galeri
                                </h3>
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                    style={{
                                        background: urls.length >= MAX_GALLERY_PHOTOS ? 'rgba(239,68,68,0.1)' : 'var(--ui-badge-bg)',
                                        color: urls.length >= MAX_GALLERY_PHOTOS ? '#ef4444' : 'var(--ui-text-muted)'
                                    }}>
                                    {urls.length} / {MAX_GALLERY_PHOTOS} foto
                                </span>
                            </div>
                        </div>

                        {urls.length >= MAX_GALLERY_PHOTOS ? (
                            <div className="rounded-2xl p-6 text-center border bg-red-500/5 border-red-500/20">
                                <p className="text-sm font-semibold text-red-500">Batas Maksimal Tercapai</p>
                                <p className="text-xs text-red-400 mt-1">Anda sudah mengupload foto galeri hingga batas maksimum ({MAX_GALLERY_PHOTOS} foto).</p>
                            </div>
                        ) : (
                            <>
                                {/* Input mode switcher */}
                                <div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'var(--ui-bg-hover)' }}>
                                    {(['upload', 'url'] as const).map(mode => (
                                        <button key={mode} onClick={() => setInputMode(mode)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all"
                                            style={inputMode === mode
                                                ? { background: 'var(--ui-bg-card)', color: 'var(--ui-text-primary)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                                                : { color: 'var(--ui-text-muted)' }}>
                                            {mode === 'upload' ? <><Upload className="w-3.5 h-3.5" /> Upload dari Komputer</> : <><LinkIcon className="w-3.5 h-3.5" /> Gunakan URL</>}
                                        </button>
                                    ))}
                                </div>

                                {inputMode === 'upload' && (
                                    <div className="space-y-3">
                                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryFileChange} />
                                        <div onDrop={handleGalleryDrop} onDragOver={handleGalleryDragOver} onDragLeave={handleGalleryDragLeave}
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all"
                                            style={{
                                                borderColor: isDragging ? 'var(--color-gold, #c9a96e)' : 'var(--ui-input-border)',
                                                background: isDragging ? 'rgba(201,169,110,0.07)' : 'var(--ui-input-bg)',
                                            }}>
                                            {uploading ? (
                                                <><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold, #c9a96e)' }} />
                                                    <p className="text-sm font-medium" style={{ color: 'var(--ui-text-muted)' }}>Mengupload...</p></>
                                            ) : (
                                                <>
                                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.12)' }}>
                                                        <ImageIcon className="w-7 h-7" style={{ color: 'var(--color-gold, #c9a96e)' }} />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-semibold" style={{ color: 'var(--ui-text-primary)' }}>Drag &amp; drop foto ke sini</p>
                                                        <p className="text-xs mt-1" style={{ color: 'var(--ui-text-muted)' }}>atau klik untuk memilih file (bisa multi)</p>
                                                        <p className="text-xs mt-2" style={{ color: 'var(--ui-text-muted)' }}>JPG, PNG, WebP, GIF · Maks. 5MB per file</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {uploadError && <p className="text-sm text-red-500 flex items-center gap-1.5"><X className="w-4 h-4" /> {uploadError}</p>}
                                    </div>
                                )}

                                {inputMode === 'url' && (
                                    <div className="flex gap-3">
                                        <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://contoh.com/foto.jpg"
                                            className="flex-1 rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all border"
                                            style={{ background: 'var(--ui-input-bg)', borderColor: 'var(--ui-input-border)', color: 'var(--ui-text-primary)' }}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())} />
                                        <button type="button" onClick={addUrl}
                                            className="flex items-center gap-2 bg-gold/10 text-primary border border-gold/30 px-5 py-3 rounded-2xl font-bold hover:bg-gold hover:text-primary transition-all text-sm">
                                            <Plus className="w-4 h-4" /> Tambah
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Gallery preview */}
                    <div className="rounded-3xl p-6 border shadow-sm space-y-4"
                        style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
                        <h3 className="font-bold text-base flex items-center gap-2" style={{ color: 'var(--ui-text-primary)' }}>
                            Pratinjau Galeri
                            {urls.length > 0 && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                                    style={{ background: 'rgba(201,169,110,0.15)', color: 'var(--color-gold, #c9a96e)' }}>
                                    {urls.length} foto
                                </span>
                            )}
                        </h3>

                        {urls.length === 0 ? (
                            <p className="text-sm text-center py-8" style={{ color: 'var(--ui-text-muted)' }}>
                                Belum ada foto galeri.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {urls.map((url, i) => (
                                    <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border"
                                        style={{ background: 'var(--ui-bg-hover)', borderColor: 'var(--ui-border)' }}>
                                        <img src={url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            onError={e => { (e.target as HTMLImageElement).src = '/images/gallery_1.png'; }} />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                                        <button onClick={() => removeUrl(i)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 hover:scale-110">
                                            <X className="w-3 h-3" />
                                        </button>
                                        <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                                            #{i + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button onClick={saveGallery} disabled={saving}
                            className="flex items-center gap-2 bg-elegant text-gold border border-gold/30 px-6 py-3 rounded-full font-bold hover:bg-gold hover:text-primary transition-all text-sm disabled:opacity-60">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4 text-emerald-400" /> : null}
                            {saved ? 'Tersimpan!' : 'Simpan Galeri'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
