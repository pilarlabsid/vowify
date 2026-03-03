'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { WeddingData } from "@/lib/types";

export default function Gallery({ data }: { data: WeddingData }) {
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    return (
        <section className="py-24 px-6 bg-cream">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl text-center text-primary mb-12 font-script">Galeri Foto</h2>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
                    {data.gallery.map((img, i) => (
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
