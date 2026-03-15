'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Loader2, Plus, X, Check, Upload, Link as LinkIcon,
    ImageIcon, Camera, Image as GalleryIcon,
    Layers, ChevronDown, ChevronUp, Star, QrCode,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '../dashboard-context';
import { SelectWeddingPrompt } from '../components';
import { ImageCropModal } from '../components/ImageCropModal';
import { UnsavedChangesModal } from '../components/UnsavedChangesModal';
import {
    getPhotoSlotsBySection, getOtherTemplatePhotos,
    isCanonicalSlot, PhotoSlot, TEMPLATES,
} from '@/templates/registry';

// ─── Upload limits (sync with api/upload/route.ts) ───────────────────────────
const MAX_FILE_BYTES = 5 * 1024 * 1024;       // 5 MB per foto
const QUOTA_BYTES = 10 * 1024 * 1024;      // 10 MB total
const MAX_FILE_LABEL = '5 MB';
const QUOTA_LABEL = '10 MB';

function Badge({ children, color = 'gold' }: {
    children: React.ReactNode;
    color?: 'gold' | 'blue' | 'green' | 'red' | 'muted';
}) {
    const styles: Record<string, React.CSSProperties> = {
        gold: { background: 'rgba(201,169,110,0.15)', color: 'var(--color-gold, #c9a96e)' },
        blue: { background: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
        green: { background: 'rgba(16,185,129,0.12)', color: '#34d399' },
        red: { background: 'rgba(239,68,68,0.12)', color: '#f87171' },
        muted: { background: 'var(--ui-badge-bg)', color: 'var(--ui-text-muted)' },
    };
    return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={styles[color]}>
            {children}
        </span>
    );
}

// ─── Single slot uploader ─────────────────────────────────────────────────────
interface SlotUploaderProps {
    slot: PhotoSlot;
    currentUrl: string;
    onUploaded: (url: string) => void;
    onRemove?: () => void;
    /** Compact mode dipakai di gallery grid */
    compact?: boolean;
}

function SlotUploader({ slot, currentUrl, onUploaded, onRemove, compact }: SlotUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [urlMode, setUrlMode] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Crop modal state
    const [cropSrc, setCropSrc] = useState<string | null>(null); // object URL of selected file

    // ── Upload blob/file to API ──────────────────────────────────────────────
    const uploadBlob = useCallback(async (blob: Blob, filename = 'photo.webp') => {
        setError('');
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', new File([blob], filename, { type: blob.type || 'image/webp' }));
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

    // ── File selected: validate then open crop modal (except GIF) ───────────
    const handleFile = useCallback((file: File) => {
        setError('');
        if (!file.type.startsWith('image/')) {
            setError('File harus berupa gambar (JPG, PNG, WebP, dll).');
            return;
        }
        if (file.size > MAX_FILE_BYTES) {
            setError(`Ukuran foto terlalu besar. Maksimal ${MAX_FILE_LABEL} per foto.`);
            return;
        }
        if (file.type === 'image/gif') {
            // GIF: upload langsung tanpa crop (jaga animasi)
            uploadBlob(file, file.name);
            return;
        }
        // Non-GIF: tampilkan crop modal
        const objectUrl = URL.createObjectURL(file);
        setCropSrc(objectUrl);
    }, [uploadBlob]);


    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = Array.from(e.dataTransfer.files).find(f => f.type.startsWith('image/'));
        if (file) handleFile(file);
    }, [handleFile]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        if (inputRef.current) inputRef.current.value = '';
    }, [handleFile]);

    // ── Crop confirmed: upload blob ──────────────────────────────────────────
    const handleCropConfirm = useCallback(async (blob: Blob) => {
        if (cropSrc) URL.revokeObjectURL(cropSrc);
        setCropSrc(null);
        await uploadBlob(blob);
    }, [cropSrc, uploadBlob]);

    const handleCropCancel = useCallback(() => {
        if (cropSrc) URL.revokeObjectURL(cropSrc);
        setCropSrc(null);
    }, [cropSrc]);

    const applyUrl = () => {
        if (urlInput.trim()) { onUploaded(urlInput.trim()); setUrlInput(''); setUrlMode(false); }
    };

    const aspectStyle = { aspectRatio: slot.aspect.replace('/', ' / ') };

    // ── Crop modal (rendered above everything) ───────────────────────────────
    const cropModal = cropSrc ? (
        <ImageCropModal
            imageSrc={cropSrc}
            aspect={slot.aspect}
            label={slot.label}
            onConfirm={handleCropConfirm}
            onCancel={handleCropCancel}
        />
    ) : null;

    // ── Compact mode: dipakai di gallery grid ──────────────────────────────
    if (compact) {
        return (
            <>
                {cropModal}
                <div className="rounded-2xl overflow-hidden border group transition-all relative"
                    style={{ borderColor: currentUrl ? 'var(--color-gold, #c9a96e)' : 'var(--ui-border)', background: 'var(--ui-bg-hover)' }}>
                    {/* Aspect ratio box */}
                    <div style={aspectStyle} className="relative w-full">
                        {currentUrl ? (
                            <>
                                <img src={currentUrl} alt={slot.label} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                {/* overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    <button type="button"
                                        onClick={() => inputRef.current?.click()}
                                        className="bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white transition-all shadow-lg text-xs font-bold flex items-center gap-1">
                                        <Upload className="w-3 h-3" /> Ganti
                                    </button>
                                    {onRemove && (
                                        <button type="button" onClick={onRemove}
                                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg">
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div
                                onDrop={handleDrop}
                                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onClick={() => inputRef.current?.click()}
                                className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
                                style={{
                                    background: isDragging ? 'rgba(201,169,110,0.10)' : 'var(--ui-bg-hover)',
                                }}>
                                {uploading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-gold, #c9a96e)' }} />
                                ) : (
                                    <>
                                        <Camera className="w-6 h-6 opacity-25" style={{ color: 'var(--ui-text-muted)' }} />
                                        <span className="text-[10px] font-medium text-center px-2" style={{ color: 'var(--ui-text-muted)' }}>
                                            Klik / drag foto
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
                    {/* Slot label footer */}
                    <div className="px-2 py-1.5 flex items-center justify-between gap-1"
                        style={{ borderTop: '1px solid var(--ui-border)' }}>
                        <span className="text-[10px] font-semibold truncate" style={{ color: 'var(--ui-text-secondary)' }}>
                            {slot.label}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                            {slot.required
                                ? <Badge color="gold">Wajib</Badge>
                                : <Badge color="muted">Opsional</Badge>
                            }
                        </div>
                    </div>
                    {error && (
                        <p className="text-[10px] text-red-400 px-2 pb-1.5 flex items-center gap-1">
                            <X className="w-3 h-3" /> {error}
                        </p>
                    )}
                </div>
            </>
        );
    }

    // ── Standard mode ─────────────────────────────────────────────────────────
    return (
        <>
            {cropModal}
            <div className="rounded-2xl border overflow-hidden transition-all"
                style={{ borderColor: currentUrl ? 'rgba(201,169,110,0.35)' : 'var(--ui-border)', background: 'var(--ui-bg-card)' }}>

                {/* Header */}
                <div className="px-4 pt-3 pb-2 flex items-start justify-between gap-2"
                    style={{ borderBottom: '1px solid var(--ui-border)' }}>
                    <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center flex-wrap gap-1.5">
                            <span className="text-sm font-bold" style={{ color: 'var(--ui-text-primary)' }}>
                                {slot.label}
                            </span>
                            {slot.required && <Badge color="gold">Wajib</Badge>}
                            {isCanonicalSlot(slot.key) && <Badge color="blue">✦ Universal</Badge>}
                            {!slot.required && !isCanonicalSlot(slot.key) && <Badge color="muted">Opsional</Badge>}
                        </div>
                        {slot.hint && (
                            <p className="text-[11px]" style={{ color: 'var(--ui-text-muted)' }}>
                                {slot.hint}
                            </p>
                        )}
                    </div>
                    {/* URL toggle always visible */}
                    <button type="button" onClick={() => setUrlMode(!urlMode)}
                        className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border transition-all shrink-0"
                        style={{ color: urlMode ? 'var(--color-gold,#c9a96e)' : 'var(--ui-text-muted)', borderColor: urlMode ? 'rgba(201,169,110,0.4)' : 'var(--ui-border)' }}>
                        <LinkIcon className="w-3 h-3" />
                        {urlMode ? 'Upload' : 'URL'}
                    </button>
                </div>

                {/* URL input mode */}
                {urlMode ? (
                    <div className="p-4 flex gap-2">
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
                ) : currentUrl ? (
                    /* ── Foto sudah ada: tampil besar dengan overlay hover ── */
                    <div className="relative group" style={aspectStyle}>
                        <img
                            src={currentUrl} alt={slot.label}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                            <button type="button"
                                onClick={() => inputRef.current?.click()}
                                className="flex items-center gap-1.5 bg-white/95 text-gray-800 px-3 py-2 rounded-full text-xs font-bold hover:bg-white shadow-lg transition-all">
                                <Upload className="w-3.5 h-3.5" /> Ganti
                            </button>
                            {onRemove && (
                                <button type="button" onClick={onRemove}
                                    className="flex items-center gap-1.5 bg-red-500/90 text-white px-3 py-2 rounded-full text-xs font-bold hover:bg-red-500 shadow-lg transition-all">
                                    <X className="w-3.5 h-3.5" /> Hapus
                                </button>
                            )}
                        </div>
                        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
                    </div>
                ) : (
                    /* ── Belum ada foto: tampilkan dropzone ── */
                    <div
                        onDrop={handleDrop}
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => inputRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-3 py-10 cursor-pointer transition-all"
                        style={{
                            background: isDragging ? 'rgba(201,169,110,0.07)' : 'transparent',
                            borderTop: isDragging ? '2px dashed var(--color-gold,#c9a96e)' : '2px dashed transparent',
                        }}>
                        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
                        {uploading ? (
                            <>
                                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold, #c9a96e)' }} />
                                <p className="text-xs" style={{ color: 'var(--ui-text-muted)' }}>Mengupload...</p>
                            </>
                        ) : (
                            <>
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
                                    style={{ background: 'var(--ui-bg-hover)' }}>
                                    <Upload className="w-6 h-6" style={{ color: 'var(--color-gold, #c9a96e)' }} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold" style={{ color: 'var(--ui-text-primary)' }}>
                                        Upload Foto
                                    </p>
                                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--ui-text-muted)' }}>
                                        Drag & drop atau klik di sini · Maks. {MAX_FILE_LABEL}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {error && (
                    <div className="px-4 pb-3">
                        <p className="text-xs text-red-400 flex items-center gap-1">
                            <X className="w-3 h-3" /> {error}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

// ─── Photos from other templates (collapsible) ─────────────────────────────
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

// ─── Gallery progress indicator ───────────────────────────────────────────────
function GalleryProgress({ filled, total, required }: { filled: number; total: number; required: number }) {
    const pct = total > 0 ? (filled / total) * 100 : 0;
    const color = filled >= required
        ? 'var(--color-gold, #c9a96e)'
        : '#f87171';
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--ui-text-muted)' }}>
                    {filled >= required ? '✓ Minimal terpenuhi' : `Minimal ${required} foto wajib`}
                </span>
                <span className="font-bold" style={{ color }}>
                    {filled} / {total}
                </span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--ui-bg-hover)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type Tab = 'template_photos' | 'gallery' | 'qris';

export default function PhotosPage() {
    const { selectedWedding: wedding, fetchWeddings, loading: ctxLoading } = useDashboard();

    // Unified photos state (covers all slots including gallery_1..6)
    const [photos, setPhotos] = useState<Record<string, string>>({});
    const [qris, setQris] = useState('');          // stored in wedding.qris (separate field)
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [qrisSaving, setQrisSaving] = useState(false);
    const [qrisSaved, setQrisSaved] = useState(false);
    const [qrisUploading, setQrisUploading] = useState(false);
    const [qrisError, setQrisError] = useState('');

    // UI
    const [activeTab, setActiveTab] = useState<Tab>('template_photos');
    const [storageInfo, setStorageInfo] = useState<{ used: string; quota: string; percentUsed: number } | null>(null);

    // ── Pending URL tracking (uploaded to disk, not yet committed to DB) ───────
    // These are cleaned up automatically if user navigates away without saving.
    const pendingUrlsRef = useRef<Set<string>>(new Set());
    const [hasUnsaved, setHasUnsaved] = useState(false);
    const [showUnsaved, setShowUnsaved] = useState(false);
    const pendingNavRef = useRef<(() => void) | null>(null); // callback after confirm

    // Track whether photos/qris state differs from what's in DB
    const committedPhotosRef = useRef<Record<string, string>>({});

    const fetchStorage = useCallback(async () => {
        try {
            const res = await fetch('/api/storage/info');
            if (res.ok) setStorageInfo(await res.json());
        } catch { }
    }, []);

    useEffect(() => { fetchStorage(); }, [fetchStorage]);

    // Sync photos dan qris dari wedding data
    useEffect(() => {
        if (!wedding) return;

        // photos tersimpan sebagai JSON di DB
        const raw = (wedding as any).photos;
        const parsed: Record<string, string> = typeof raw === 'string'
            ? JSON.parse(raw || '{ }')
            : (raw ?? {});

        setPhotos(parsed);
        committedPhotosRef.current = { ...parsed };
        setQris((wedding as any).qris || '');
    }, [wedding]);

    // Handle navigation with unsaved changes guard
    const router = useRouter();

    // Helper: delete pending (orphan) files from disk
    const cleanupPending = useCallback(async (urls?: Set<string>) => {
        const toDelete = urls ?? pendingUrlsRef.current;
        const arr = Array.from(toDelete);
        if (arr.length === 0) return;
        await Promise.all(arr.map(url =>
            fetch(`/api/upload?url=${encodeURIComponent(url)}`, { method: 'DELETE' }).catch(() => { })
        ));
        pendingUrlsRef.current = new Set();
        setHasUnsaved(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => { cleanupPending(); };
    }, [cleanupPending]);

    // Browser tab/window close guard
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (pendingUrlsRef.current.size === 0) return;
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, []);

    // Intercept client-side link clicks (e.g. from Sidebar)
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!hasUnsaved) return;
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');
            if (!anchor) return;

            if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('#') || href === window.location.pathname) return;

            // Stop normal navigation
            e.preventDefault();
            e.stopPropagation();
            pendingNavRef.current = () => router.push(href);
            setShowUnsaved(true);
        };

        // Use capture phase to intercept before Next.js Link handles it
        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, [hasUnsaved, router]);

    const navigateWithGuard = useCallback((href: string) => {
        if (!hasUnsaved) { router.push(href); return; }
        pendingNavRef.current = () => router.push(href);
        setShowUnsaved(true);
    }, [hasUnsaved, router]);

    // Called when a new photo is uploaded to disk (preview only, not yet in DB)
    const handlePhotoUploaded = useCallback((key: string, url: string, oldUrl: string) => {
        // If replacing a previous pending URL for same slot, delete it
        if (oldUrl && oldUrl.startsWith('/uploads/') && pendingUrlsRef.current.has(oldUrl)) {
            fetch(`/api/upload?url=${encodeURIComponent(oldUrl)}`, { method: 'DELETE' }).catch(() => { });
            pendingUrlsRef.current.delete(oldUrl);
        }
        if (url.startsWith('/uploads/')) pendingUrlsRef.current.add(url);
        setPhotos(prev => ({ ...prev, [key]: url }));
        setHasUnsaved(true);
    }, []);

    // Called when user removes a photo slot
    const handlePhotoRemoved = useCallback((key: string, oldUrl: string) => {
        // If it was a pending (unsaved) local file, delete from disk immediately
        if (oldUrl.startsWith('/uploads/') && pendingUrlsRef.current.has(oldUrl)) {
            fetch(`/api/upload?url=${encodeURIComponent(oldUrl)}`, { method: 'DELETE' }).catch(() => { });
            pendingUrlsRef.current.delete(oldUrl);
        }
        setPhotos(prev => { const n = { ...prev }; delete n[key]; return n; });
        // If it was a committed photo, we now have unsaved removal
        if (committedPhotosRef.current[key]) setHasUnsaved(true);
        if (pendingUrlsRef.current.size === 0 && !hasUnsaved) setHasUnsaved(false);
    }, [hasUnsaved]);


    // ── Early returns AFTER all hooks ──────────────────────────────────────────
    if (ctxLoading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
    if (!wedding) return <SelectWeddingPrompt />;

    const themeId = (wedding as any).themeId || 'javanese';
    const slotsBySection = getPhotoSlotsBySection(themeId);
    const currentTemplate = TEMPLATES.find(t => t.id === themeId);

    // Split sections: gallery vs. non-gallery
    const gallerySectionName = 'Galeri';
    const gallerySlots = slotsBySection[gallerySectionName] ?? [];
    const nonGallerySections = Object.entries(slotsBySection).filter(([s]) => s !== gallerySectionName);

    // Stats
    const allNonGallerySlots = nonGallerySections.flatMap(([, s]) => s);
    const filledNonGallery = allNonGallerySlots.filter(s => !!photos[s.key]).length;
    const filledGallery = gallerySlots.filter(s => !!photos[s.key]).length;
    const requiredGallery = gallerySlots.filter(s => s.required).length;

    const save = async () => {
        if (!wedding) return;
        setSaving(true);
        await fetch(`/api/weddings/${wedding.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photos }),
        });
        // Commit: photos are now saved, clear pending
        committedPhotosRef.current = { ...photos };
        pendingUrlsRef.current = new Set();
        setHasUnsaved(false);
        setSaving(false);
        setSaved(true);
        fetchWeddings();
        fetchStorage();
        setTimeout(() => setSaved(false), 3000);
    };

    const handleUnsavedSave = async () => {
        await save();
        setShowUnsaved(false);
        if (pendingNavRef.current) { pendingNavRef.current(); pendingNavRef.current = null; }
    };

    const handleUnsavedDiscard = async () => {
        await cleanupPending();
        setPhotos({ ...committedPhotosRef.current });
        setShowUnsaved(false);
        if (pendingNavRef.current) { pendingNavRef.current(); pendingNavRef.current = null; }
    };

    const handleUnsavedCancel = () => {
        setShowUnsaved(false);
        pendingNavRef.current = null;
    };

    const saveQris = async () => {
        setQrisSaving(true);
        await fetch(`/api/weddings/${wedding.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ qris }),
        });
        setQrisSaving(false);
        setQrisSaved(true);
        fetchWeddings();
        fetchStorage();
        setTimeout(() => setQrisSaved(false), 3000);
    };

    const uploadQris = async (file: File) => {
        setQrisError('');
        if (!file.type.startsWith('image/')) { setQrisError('File harus berupa gambar.'); return; }
        if (file.size > MAX_FILE_BYTES) { setQrisError(`Maksimal ${MAX_FILE_LABEL} per file.`); return; }
        setQrisUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal upload');
            setQris(data.url);
        } catch (e: any) { setQrisError((e as Error).message); }
        finally { setQrisUploading(false); }
    };

    const tabs: { key: Tab; label: string; icon: React.ReactNode; badge?: string }[] = [
        {
            key: 'template_photos',
            label: 'Foto Template',
            icon: <Camera className="w-4 h-4" />,
            badge: allNonGallerySlots.length > 0
                ? `${filledNonGallery}/${allNonGallerySlots.length}`
                : undefined,
        },
        {
            key: 'gallery',
            label: 'Galeri Foto',
            icon: <GalleryIcon className="w-4 h-4" />,
            badge: gallerySlots.length > 0
                ? `${filledGallery}/${gallerySlots.length}`
                : undefined,
        },
        {
            key: 'qris',
            label: 'QRIS',
            icon: <QrCode className="w-4 h-4" />,
            badge: qris ? '✓' : undefined,
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {showUnsaved && (
                <UnsavedChangesModal
                    onSave={handleUnsavedSave}
                    onDiscard={handleUnsavedDiscard}
                    onCancel={handleUnsavedCancel}
                    saving={saving}
                />
            )}

            {/* Storage Indicator */}
            {storageInfo && (
                <div className="rounded-2xl p-4 border" style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 opacity-50" style={{ color: 'var(--ui-text-primary)' }} />
                            <span className="text-xs font-bold" style={{ color: 'var(--ui-text-primary)' }}>Penyimpanan Anda</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                                style={{ background: 'var(--ui-badge-bg)', color: 'var(--ui-text-muted)' }}>
                                maks {MAX_FILE_LABEL}/foto
                            </span>
                            <span className="text-[11px] font-medium" style={{ color: 'var(--ui-text-muted)' }}>
                                {storageInfo.used} / {storageInfo.quota}
                            </span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--ui-bg-hover)' }}>
                        <div className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${storageInfo.percentUsed}%`,
                                background: storageInfo.percentUsed > 80 ? '#ef4444'
                                    : storageInfo.percentUsed > 60 ? '#f59e0b'
                                        : 'var(--color-gold, #c9a96e)',
                            }}
                        />
                    </div>
                    {storageInfo.percentUsed > 80 && (
                        <p className="text-[10px] text-red-400 mt-2">
                            ⚠ Penyimpanan hampir penuh ({storageInfo.used} / {QUOTA_LABEL}). Hapus foto yang tidak diperlukan.
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

                    {/* Active template label */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full border"
                            style={{ background: 'rgba(201,169,110,0.08)', borderColor: 'rgba(201,169,110,0.2)', color: 'var(--color-gold, #c9a96e)' }}>
                            Template aktif: <span className="capitalize">{currentTemplate?.name ?? themeId}</span>
                        </span>
                        <span className="text-xs" style={{ color: 'var(--ui-text-muted)' }}>
                            Foto berlabel <strong style={{ color: '#60a5fa' }}>✦ Universal</strong> otomatis terbawa saat ganti tema
                        </span>
                    </div>

                    {/* Non-gallery slot sections */}
                    {nonGallerySections.length === 0 ? (
                        <div className="rounded-3xl p-12 text-center border-2 border-dashed"
                            style={{ borderColor: 'var(--ui-border)', background: 'var(--ui-bg-hover)' }}>
                            <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: 'var(--ui-text-muted)' }} />
                            <p className="text-sm font-medium" style={{ color: 'var(--ui-text-secondary)' }}>
                                Template ini belum mendefinisikan foto slot.
                            </p>
                        </div>
                    ) : (
                        <>
                            {nonGallerySections.map(([sectionName, slots]) => (
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
                                                onUploaded={url => handlePhotoUploaded(slot.key, url, photos[slot.key] ?? '')}
                                                onRemove={() => handlePhotoRemoved(slot.key, photos[slot.key] ?? '')}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Photos from other templates (collapsible) */}
                    <OtherTemplatePhotosSection photos={photos} currentThemeId={themeId} />

                    {/* Save */}
                    <button onClick={save} disabled={saving || !hasUnsaved}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all text-sm disabled:opacity-60
                            ${hasUnsaved
                                ? 'bg-gold text-primary shadow-lg scale-105'
                                : 'bg-elegant text-gold border border-gold/30 hover:bg-gold hover:text-primary'
                            }`}
                    >
                        {saving
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : saved
                                ? <Check className="w-4 h-4 text-emerald-400" />
                                : <Upload className="w-4 h-4" />
                        }
                        {saved ? 'Tersimpan!' : hasUnsaved ? 'Simpan Foto*' : 'Simpan Foto'}
                    </button>
                </div>
            )}

            {/* ══ TAB: GALERI ══ */}
            {activeTab === 'gallery' && (
                <div className="space-y-5">

                    {/* Info banner */}
                    <div className="rounded-2xl p-4 border flex items-start gap-3"
                        style={{ background: 'rgba(96,165,250,0.05)', borderColor: 'rgba(96,165,250,0.2)' }}>
                        <Star className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#60a5fa' }} />
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold" style={{ color: '#60a5fa' }}>Galeri Universal</p>
                            <p className="text-[11px]" style={{ color: 'var(--ui-text-muted)' }}>
                                Foto galeri ini berlaku di <strong>semua template</strong>. Upload sekali, tampil di semua tema.
                                Foto 1–3 wajib, foto 4–6 opsional.
                            </p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    {gallerySlots.length > 0 && (
                        <div className="rounded-2xl p-4 border" style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
                            <GalleryProgress
                                filled={filledGallery}
                                total={gallerySlots.length}
                                required={requiredGallery}
                            />
                        </div>
                    )}

                    {/* Gallery grid */}
                    {gallerySlots.length === 0 ? (
                        <div className="rounded-3xl p-12 text-center border-2 border-dashed"
                            style={{ borderColor: 'var(--ui-border)', background: 'var(--ui-bg-hover)' }}>
                            <GalleryIcon className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: 'var(--ui-text-muted)' }} />
                            <p className="text-sm font-medium" style={{ color: 'var(--ui-text-secondary)' }}>
                                Template ini belum mendefinisikan slot galeri.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-3xl p-6 border shadow-sm space-y-5"
                            style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-base" style={{ color: 'var(--ui-text-primary)' }}>
                                    Foto Galeri
                                </h3>
                                <span className="text-xs" style={{ color: 'var(--ui-text-muted)' }}>
                                    Klik foto untuk mengganti · Drag & drop didukung
                                </span>
                            </div>

                            {/* 3-col grid untuk galeri */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {gallerySlots.map(slot => (
                                    <SlotUploader
                                        key={slot.key}
                                        slot={slot}
                                        currentUrl={photos[slot.key] ?? ''}
                                        onUploaded={url => handlePhotoUploaded(slot.key, url, photos[slot.key] ?? '')}
                                        onRemove={() => handlePhotoRemoved(slot.key, photos[slot.key] ?? '')}
                                        compact
                                    />
                                ))}
                            </div>

                            {/* Tip untuk urutan */}
                            <p className="text-[11px]" style={{ color: 'var(--ui-text-muted)' }}>
                                💡 Foto tampil di undangan sesuai urutan nomor. Isi dari foto 1 terlebih dahulu.
                            </p>
                        </div>
                    )}

                    {/* Save */}
                    <button onClick={save} disabled={saving || !hasUnsaved}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all text-sm disabled:opacity-60
                            ${hasUnsaved
                                ? 'bg-gold text-primary shadow-lg scale-105'
                                : 'bg-elegant text-gold border border-gold/30 hover:bg-gold hover:text-primary'
                            }`}
                    >
                        {saving
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : saved
                                ? <Check className="w-4 h-4 text-emerald-400" />
                                : <Upload className="w-4 h-4" />
                        }
                        {saved ? 'Tersimpan!' : hasUnsaved ? 'Simpan Galeri*' : 'Simpan Galeri'}
                    </button>
                </div>
            )}

            {/* ══ TAB: QRIS ══ */}
            {activeTab === 'qris' && (
                <div className="space-y-5">

                    {/* Info banner */}
                    <div className="rounded-2xl p-4 border flex items-start gap-3"
                        style={{ background: 'rgba(201,169,110,0.05)', borderColor: 'rgba(201,169,110,0.2)' }}>
                        <QrCode className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--color-gold, #c9a96e)' }} />
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold" style={{ color: 'var(--color-gold, #c9a96e)' }}>Kode QRIS</p>
                            <p className="text-[11px]" style={{ color: 'var(--ui-text-muted)' }}>
                                Upload foto kode QRIS dari bank/dompet digital Anda. Tamu bisa scan langsung dari undangan.
                                Gunakan screenshot QRIS yang jelas dan tidak terpotong.
                            </p>
                        </div>
                    </div>

                    {/* QRIS Uploader */}
                    <div className="rounded-3xl p-6 border shadow-sm space-y-5"
                        style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
                        <h3 className="font-bold text-base" style={{ color: 'var(--ui-text-primary)' }}>
                            Upload Kode QRIS
                        </h3>

                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            {/* Preview / Drop zone */}
                            <div
                                className="relative w-full sm:w-56 aspect-square rounded-2xl overflow-hidden border-2 border-dashed flex items-center justify-center shrink-0 transition-all"
                                style={{ borderColor: qris ? 'rgba(201,169,110,0.4)' : 'var(--ui-border)', background: 'var(--ui-bg-hover)' }}
                                onDragOver={e => e.preventDefault()}
                                onDrop={async e => {
                                    e.preventDefault();
                                    const file = Array.from(e.dataTransfer.files).find(f => f.type.startsWith('image/'));
                                    if (file) await uploadQris(file);
                                }}
                            >
                                {qris ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={qris} alt="QRIS preview" className="w-full h-full object-contain p-2" />
                                        {/* Scan line animation overlay */}
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                                            <div className="absolute left-4 right-4 h-0.5 bg-gold animate-[scan_2s_linear_infinite]"
                                                style={{ animationName: 'none', top: '30%' }} />
                                        </div>
                                        {/* Remove button */}
                                        <button
                                            onClick={() => setQris('')}
                                            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all"
                                            style={{ background: 'rgba(239,68,68,0.85)', color: '#fff' }}
                                            title="Hapus QRIS"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <QrCode className="w-10 h-10 mx-auto mb-2 opacity-20" style={{ color: 'var(--ui-text-muted)' }} />
                                        <p className="text-[11px]" style={{ color: 'var(--ui-text-muted)' }}>
                                            Drag & drop atau klik tombol di bawah
                                        </p>
                                    </div>
                                )}
                                {qrisUploading && (
                                    <div className="absolute inset-0 flex items-center justify-center"
                                        style={{ background: 'rgba(0,0,0,0.4)' }}>
                                        <Loader2 className="w-8 h-8 animate-spin text-gold" />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex-1 space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer px-5 py-3 rounded-xl border font-semibold text-sm w-full justify-center transition-all hover:bg-gold/5"
                                    style={{ borderColor: 'var(--ui-border)', color: 'var(--ui-text-primary)' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async e => {
                                            const file = e.target.files?.[0];
                                            if (file) await uploadQris(file);
                                            e.target.value = '';
                                        }}
                                    />
                                    <Upload className="w-4 h-4" />
                                    {qris ? 'Ganti Foto QRIS' : 'Pilih Foto QRIS'}
                                </label>

                                {qrisError && (
                                    <p className="text-xs text-red-400 px-1">{qrisError}</p>
                                )}

                                <p className="text-[11px] px-1" style={{ color: 'var(--ui-text-muted)' }}>
                                    Format: JPG, PNG, WebP · Maks {MAX_FILE_LABEL}
                                </p>

                                {qris && (
                                    <p className="text-[11px] px-1 text-emerald-400 flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Foto QRIS siap — klik Simpan untuk menyimpan
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Save */}
                    <button onClick={saveQris} disabled={qrisSaving}
                        className="flex items-center gap-2 bg-elegant text-gold border border-gold/30 px-6 py-3 rounded-full font-bold hover:bg-gold hover:text-primary transition-all text-sm disabled:opacity-60">
                        {qrisSaving
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : qrisSaved
                                ? <Check className="w-4 h-4 text-emerald-400" />
                                : <QrCode className="w-4 h-4" />
                        }
                        {qrisSaved ? 'Tersimpan!' : 'Simpan QRIS'}
                    </button>
                </div>
            )}
        </div>
    );
}
