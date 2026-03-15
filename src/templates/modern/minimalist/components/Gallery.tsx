'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Camera, X, ZoomIn } from "lucide-react";
import { WeddingData } from "@/lib/types";

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
    const fromPhotos = [1, 2, 3, 4, 5, 6]
        .map(n => photos[`gallery_${n}`])
        .filter((v): v is string => !!v && v.trim() !== '');

    const fromGallery = (data.gallery ?? []).filter((v): v is string => !!v && v.trim() !== '');

    const images: string[] = fromPhotos.length > 0
        ? fromPhotos
        : fromGallery.length > 0
            ? fromGallery
            : FALLBACK_GALLERY;

    return (
        <section className="py-20 md:py-28 px-6" style={{ background: 'var(--mn-bg)' }}>
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mn-section-head"
                >
                    <p className="mn-label mb-3">Kenangan Indah</p>
                    <h2>Gallery</h2>
                    <div className="mn-line-group mt-4">
                        <div className="line" />
                        <div className="dot" />
                        <div className="line" />
                    </div>
                </motion.div>

                {/* Masonry grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[260px]">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06 }}
                            onClick={() => setSelectedImg(img)}
                            className={`mn-gallery-item relative cursor-zoom-in group ${i % 4 === 0 ? 'row-span-2' : ''}`}
                            style={{ border: '1px solid var(--mn-border)' }}
                        >
                            <Image
                                src={img}
                                alt={`gallery-${i}`}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Hover overlay */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                                style={{ background: 'rgba(20,20,18,0.35)' }}
                            >
                                <ZoomIn className="w-7 h-7 text-white" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedImg && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center p-4"
                    style={{ background: 'rgba(20,20,18,0.96)', backdropFilter: 'blur(12px)' }}
                    onClick={() => setSelectedImg(null)}
                >
                    <button
                        onClick={() => setSelectedImg(null)}
                        className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                        style={{ background: 'rgba(255,255,255,0.10)', color: '#fff' }}
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden"
                        style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                    >
                        <Image
                            src={selectedImg}
                            alt="selected"
                            width={900}
                            height={1200}
                            unoptimized
                            className="w-full h-auto object-contain"
                        />
                    </motion.div>
                </div>
            )}
        </section>
    );
}
