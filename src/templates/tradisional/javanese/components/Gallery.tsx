'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Camera, X } from "lucide-react";
import { WeddingData } from "@/lib/types";

export default function Gallery({ data }: { data: WeddingData }) {
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    // Read gallery from canonical photo slots (gallery_1..6), filter empty
    const photos = (data.photos ?? {}) as Record<string, string>;
    const galleryImages = [1, 2, 3, 4, 5, 6]
        .map(n => photos[`gallery_${n}`])
        .filter(Boolean) as string[];

    // Fallback: if no canonical photos, try legacy gallery array
    const images = galleryImages.length > 0
        ? galleryImages
        : (data.gallery ?? []).filter(Boolean);

    if (images.length === 0) {
        return (
            <section className="py-24 px-6 bg-cream">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl text-center text-primary mb-12 font-script">Galeri Foto</h2>
                    <div className="flex flex-col items-center gap-4 py-16 rounded-2xl border-2 border-dashed border-gold/20">
                        <Camera className="w-10 h-10 text-gold/30" />
                        <p className="text-elegant/40 text-sm font-body italic">
                            Foto galeri belum diatur. Upload foto dari dashboard.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 px-6 bg-cream">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl text-center text-primary mb-12 font-script">Galeri Foto</h2>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => setSelectedImg(img)}
                            className={`relative cursor-zoom-in overflow-hidden rounded-xl border border-gold/20 shadow-lg ${i % 3 === 0 ? 'row-span-2' : ''}`}
                        >
                            <Image
                                src={img}
                                alt={`gallery-${i}`}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                className="object-cover transform transition-transform duration-700 hover:scale-110 grayscale-50 hover:grayscale-0"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImg && (
                <div
                    className="fixed inset-0 z-[110] bg-elegant/95 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setSelectedImg(null)}
                >
                    <button
                        onClick={() => setSelectedImg(null)}
                        className="absolute top-6 right-6 text-gold/60 hover:text-gold transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-full max-w-4xl max-h-[90vh]"
                    >
                        <Image
                            src={selectedImg}
                            alt="selected"
                            width={800}
                            height={1200}
                            className="w-full h-auto object-contain rounded-lg shadow-2xl"
                        />
                    </motion.div>
                </div>
            )}
        </section>
    );
}
