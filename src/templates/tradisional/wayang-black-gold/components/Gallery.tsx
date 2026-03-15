'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Camera, X } from "lucide-react";
import { WeddingData } from "@/lib/types";

// Gambar galeri fallback (dummy/preview) — 5 foto javanese
const FALLBACK_GALLERY = [
    '/images/javanese/galery_1.webp',
    '/images/javanese/galery_2.webp',
    '/images/javanese/galery_3.webp',
    '/images/javanese/galery_4.webp',
    '/images/javanese/galery_5.webp',
];

export default function Gallery({ data }: { data: WeddingData }) {
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    const photos = (data.photos ?? {}) as Record<string, string>;

    // Prioritas 1: canonical photo slots (gallery_1 – gallery_6)
    const fromPhotos = [1, 2, 3, 4, 5, 6]
        .map(n => photos[`gallery_${n}`])
        .filter((v): v is string => !!v && v.trim() !== '');

    // Prioritas 2: deprecated data.gallery array
    const fromGallery = (data.gallery ?? []).filter((v): v is string => !!v && v.trim() !== '');

    // Prioritas 3: fallback dummy javanese images
    const images: string[] = fromPhotos.length > 0
        ? fromPhotos
        : fromGallery.length > 0
            ? fromGallery
            : FALLBACK_GALLERY;

    if (images.length === 0) {
        return (
            <section
                className="py-24 px-6 relative overflow-hidden"
                style={{ background: 'var(--wbg-black)' }}
            >
                {/* Dekorasi ornamen */}
                <div className="absolute top-0 right-0 w-48 h-48 md:h-60 pointer-events-none opacity-15">
                    <Image src="/templates/wayang-black-gold/7.2.webp" alt="Corner TR" fill
                        sizes="192px"
                        className="object-contain object-top object-right"
                        style={{ filter: 'sepia(1) saturate(0.3) brightness(0.4) hue-rotate(20deg)' }}
                    />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <p className="wbg-label mb-3">Kenangan Indah</p>
                        <h2 style={{ fontFamily: 'var(--wbg-font-display)', color: 'var(--wbg-gold)' }}
                            className="text-3xl md:text-4xl">
                            Galeri Foto
                        </h2>
                    </div>
                    <div className="flex flex-col items-center gap-4 py-16 rounded-2xl"
                        style={{ border: '1px dashed var(--wbg-border-gold)', background: 'rgba(201,168,76,0.02)' }}>
                        <Camera className="w-10 h-10" style={{ color: 'var(--wbg-gold)', opacity: 0.3 }} />
                        <p className="text-sm italic" style={{ color: 'var(--wbg-text-dim)' }}>
                            Foto galeri belum diatur. Upload foto dari dashboard.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="py-24 px-6 relative overflow-hidden"
            style={{ background: 'var(--wbg-black)' }}
        >
            {/* Ornamen asset dekoratif sudut 7 */}
            <div className="absolute top-0 right-0 w-36 h-36 md:h-44 pointer-events-none opacity-15">
                <Image src="/templates/wayang-black-gold/7.2.webp" alt="Corner TR" fill
                    sizes="144px"
                    className="object-contain object-top object-right"
                    style={{ filter: 'sepia(1) saturate(0.3) brightness(0.4) hue-rotate(20deg)' }}
                />
            </div>
            <div className="absolute bottom-0 left-0 w-36 h-36 md:h-44 pointer-events-none opacity-15">
                <Image src="/templates/wayang-black-gold/7.3.webp" alt="Corner BL" fill
                    sizes="144px"
                    className="object-contain object-bottom object-left"
                    style={{ filter: 'sepia(1) saturate(0.3) brightness(0.4) hue-rotate(20deg)' }}
                />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Judul */}
                <div className="text-center mb-12">
                    <p className="wbg-label mb-3">Kenangan Indah</p>
                    <h2
                        className="text-3xl md:text-4xl mb-4"
                        style={{ fontFamily: 'var(--wbg-font-display)', color: 'var(--wbg-gold)' }}
                    >
                        Galeri Foto
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-16 opacity-30" style={{ background: 'var(--wbg-gold)' }} />
                        <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ background: 'var(--wbg-gold)' }} />
                        <div className="h-px w-16 opacity-30" style={{ background: 'var(--wbg-gold)' }} />
                    </div>
                </div>

                {/* Grid foto */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            onClick={() => setSelectedImg(img)}
                            className={`relative cursor-zoom-in overflow-hidden rounded-xl ${i % 3 === 0 ? 'row-span-2' : ''}`}
                            style={{
                                border: '1px solid var(--wbg-border-gold)',
                                boxShadow: 'var(--wbg-shadow)',
                            }}
                        >
                            <Image
                                src={img}
                                alt={`gallery-${i}`}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                className="object-cover transform transition-all duration-700 hover:scale-110"
                            />
                            {/* Gold hover overlay */}
                            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                                style={{ background: 'rgba(201,168,76,0.08)' }} />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedImg && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md"
                    style={{ background: 'rgba(5,5,5,0.95)' }}
                    onClick={() => setSelectedImg(null)}
                >
                    <button
                        onClick={() => setSelectedImg(null)}
                        className="absolute top-6 right-6 transition-colors opacity-60 hover:opacity-100"
                        style={{ color: 'var(--wbg-gold)' }}
                    >
                        <X className="w-7 h-7" />
                    </button>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-full max-w-3xl max-h-[90vh] rounded-xl overflow-hidden"
                        style={{ border: '1px solid var(--wbg-border-glow)' }}
                    >
                        <Image
                            src={selectedImg}
                            alt="selected"
                            width={800}
                            height={1200}
                            className="w-full h-auto object-contain"
                        />
                    </motion.div>
                </div>
            )}
        </section>
    );
}
