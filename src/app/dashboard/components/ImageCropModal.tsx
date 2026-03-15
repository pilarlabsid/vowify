'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, RotateCcw, RotateCw, ZoomIn, ZoomOut, Check, CropIcon } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ImageCropModalProps {
    /** Object URL dari file yang dipilih user */
    imageSrc: string;
    /** Aspect ratio slot (e.g. "4/3", "1/1", "3/4") */
    aspect: string;
    /** Label slot untuk ditampilkan di header modal */
    label: string;
    onConfirm: (blob: Blob) => void;
    onCancel: () => void;
}

// ─── Canvas crop helper ───────────────────────────────────────────────────────
function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', reject);
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = url;
    });
}

async function getCroppedBlob(
    imageSrc: string,
    pixelCrop: CropArea,
    rotation: number,
): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Use a safe area large enough for any rotation
    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    // Rotate around center
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    // Draw image centered
    ctx.drawImage(
        image,
        safeArea / 2 - image.width / 2,
        safeArea / 2 - image.height / 2,
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    // Resize canvas to crop dimensions and paste the cropped area
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
        Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y),
    );

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            blob => blob ? resolve(blob) : reject(new Error('Canvas is empty')),
            'image/webp',
            0.88,
        );
    });
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ImageCropModal({ imageSrc, aspect, label, onConfirm, onCancel }: ImageCropModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
    const [processing, setProcessing] = useState(false);

    // Parse "4/3" → 4/3 number
    const aspectNum = (() => {
        const parts = aspect.split('/').map(Number);
        return parts.length === 2 && parts[1] !== 0 ? parts[0] / parts[1] : 1;
    })();

    const onCropComplete = useCallback((_: unknown, pixels: CropArea) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;
        setProcessing(true);
        try {
            const blob = await getCroppedBlob(imageSrc, croppedAreaPixels, rotation);
            onConfirm(blob);
        } catch (e) {
            console.error('Crop failed:', e);
        } finally {
            setProcessing(false);
        }
    };

    const rotate = (deg: number) => setRotation(r => (r + deg + 360) % 360);

    return (
        // Backdrop
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)' }}>

            <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)', maxHeight: '90vh' }}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4"
                    style={{ borderBottom: '1px solid var(--ui-border)' }}>
                    <div className="flex items-center gap-2">
                        <CropIcon className="w-4 h-4" style={{ color: 'var(--color-gold, #c9a96e)' }} />
                        <span className="font-bold text-sm" style={{ color: 'var(--ui-text-primary)' }}>
                            Edit Foto — {label}
                        </span>
                    </div>
                    <button onClick={onCancel} className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{ background: 'var(--ui-bg-hover)', color: 'var(--ui-text-muted)' }}>
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Crop area */}
                <div className="relative flex-1" style={{ minHeight: 320 }}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspectNum}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        style={{
                            containerStyle: { background: '#111' },
                            cropAreaStyle: { border: '2px solid var(--color-gold, #c9a96e)', borderRadius: 8 },
                        }}
                    />
                </div>

                {/* Controls */}
                <div className="px-5 py-4 space-y-4"
                    style={{ borderTop: '1px solid var(--ui-border)', background: 'var(--ui-bg-hover)' }}>

                    {/* Zoom */}
                    <div className="flex items-center gap-3">
                        <ZoomOut className="w-4 h-4 shrink-0" style={{ color: 'var(--ui-text-muted)' }} />
                        <input
                            type="range"
                            min={1} max={3} step={0.05}
                            value={zoom}
                            onChange={e => setZoom(Number(e.target.value))}
                            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                            style={{ accentColor: 'var(--color-gold, #c9a96e)' }}
                        />
                        <ZoomIn className="w-4 h-4 shrink-0" style={{ color: 'var(--ui-text-muted)' }} />
                        <span className="text-[11px] w-10 text-right font-mono shrink-0"
                            style={{ color: 'var(--ui-text-muted)' }}>
                            {zoom.toFixed(1)}×
                        </span>
                    </div>

                    {/* Rotate + Actions */}
                    <div className="flex items-center gap-2">
                        {/* Rotate buttons */}
                        <button onClick={() => rotate(-90)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)', color: 'var(--ui-text-secondary)' }}>
                            <RotateCcw className="w-3.5 h-3.5" /> −90°
                        </button>
                        <button onClick={() => rotate(90)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)', color: 'var(--ui-text-secondary)' }}>
                            <RotateCw className="w-3.5 h-3.5" /> +90°
                        </button>
                        <span className="text-[11px] font-mono ml-1" style={{ color: 'var(--ui-text-muted)' }}>
                            {rotation}°
                        </span>

                        <div className="flex-1" />

                        {/* Actions */}
                        <button onClick={onCancel}
                            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)', color: 'var(--ui-text-secondary)' }}>
                            Batal
                        </button>
                        <button onClick={handleConfirm} disabled={processing}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-60"
                            style={{ background: 'var(--color-gold, #c9a96e)', color: '#1a0f0a' }}>
                            {processing ? (
                                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Check className="w-3.5 h-3.5" />
                            )}
                            {processing ? 'Memproses...' : 'Terapkan'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
